"""
Book Import Script for Library Management System
Run this in Google Colab to populate your database with 1000+ books

Instructions:
1. Upload this file to Google Colab
2. Install required packages
3. Set your Supabase credentials
4. Run the script
"""

import requests
import json
import time
from typing import List, Dict
import pandas as pd

# ============================================
# CONFIGURATION - UPDATE THESE VALUES
# ============================================
SUPABASE_URL = "YOUR_SUPABASE_URL"  # e.g., https://xxxxx.supabase.co
SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"  # Your anon/public key
TARGET_BOOKS = 1000  # Number of books to import

# ============================================
# BOOK DATA SOURCES
# ============================================

class BookDataFetcher:
    """Fetch book data from multiple free APIs"""
    
    def __init__(self):
        self.open_library_base = "https://openlibrary.org"
        self.google_books_base = "https://www.googleapis.com/books/v1/volumes"
        
    def fetch_from_open_library(self, subject: str, limit: int = 100) -> List[Dict]:
        """Fetch books from Open Library API by subject"""
        books = []
        url = f"{self.open_library_base}/subjects/{subject}.json?limit={limit}"
        
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                for work in data.get('works', []):
                    book = {
                        'title': work.get('title', 'Unknown'),
                        'author': ', '.join([a.get('name', 'Unknown') for a in work.get('authors', [])[:3]]),
                        'isbn': None,
                        'cover_image_url': f"https://covers.openlibrary.org/b/id/{work.get('cover_id')}-L.jpg" if work.get('cover_id') else None,
                        'description': None,
                        'genre': subject.replace('_', ' ').title(),
                        'category': subject.replace('_', ' ').title(),
                        'publication_year': work.get('first_publish_year'),
                        'pages': None,
                        'language': 'English',
                        'publisher': None,
                        'book_type': 'physical',
                        'total_copies': 3,
                        'available_copies': 3,
                        'is_available': True
                    }
                    books.append(book)
            time.sleep(0.5)  # Rate limiting
        except Exception as e:
            print(f"Error fetching from Open Library: {e}")
        
        return books
    
    def fetch_from_google_books(self, query: str, max_results: int = 40) -> List[Dict]:
        """Fetch books from Google Books API"""
        books = []
        url = f"{self.google_books_base}?q={query}&maxResults={max_results}"
        
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                for item in data.get('items', []):
                    volume_info = item.get('volumeInfo', {})
                    
                    # Get ISBN
                    isbn = None
                    for identifier in volume_info.get('industryIdentifiers', []):
                        if identifier.get('type') in ['ISBN_13', 'ISBN_10']:
                            isbn = identifier.get('identifier')
                            break
                    
                    book = {
                        'title': volume_info.get('title', 'Unknown'),
                        'author': ', '.join(volume_info.get('authors', ['Unknown'])),
                        'isbn': isbn,
                        'cover_image_url': volume_info.get('imageLinks', {}).get('thumbnail'),
                        'description': volume_info.get('description'),
                        'genre': ', '.join(volume_info.get('categories', ['General'])),
                        'category': volume_info.get('categories', ['General'])[0] if volume_info.get('categories') else 'General',
                        'publication_year': int(volume_info.get('publishedDate', '2000')[:4]) if volume_info.get('publishedDate') else None,
                        'pages': volume_info.get('pageCount'),
                        'language': volume_info.get('language', 'en').upper(),
                        'publisher': volume_info.get('publisher'),
                        'book_type': 'both' if volume_info.get('accessInfo', {}).get('pdf', {}).get('isAvailable') else 'physical',
                        'pdf_url': volume_info.get('accessInfo', {}).get('pdf', {}).get('acsTokenLink') if volume_info.get('accessInfo', {}).get('pdf', {}).get('isAvailable') else None,
                        'total_copies': 5,
                        'available_copies': 5,
                        'is_available': True
                    }
                    books.append(book)
            time.sleep(0.5)  # Rate limiting
        except Exception as e:
            print(f"Error fetching from Google Books: {e}")
        
        return books

# ============================================
# SUPABASE UPLOADER
# ============================================

class SupabaseUploader:
    """Upload books to Supabase"""
    
    def __init__(self, url: str, key: str):
        self.url = url
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
    
    def upload_books(self, books: List[Dict], batch_size: int = 50) -> int:
        """Upload books in batches"""
        uploaded = 0
        
        for i in range(0, len(books), batch_size):
            batch = books[i:i + batch_size]
            try:
                response = requests.post(
                    f"{self.url}/rest/v1/books",
                    headers=self.headers,
                    json=batch,
                    timeout=30
                )
                
                if response.status_code in [200, 201]:
                    uploaded += len(batch)
                    print(f"✓ Uploaded batch {i//batch_size + 1}: {len(batch)} books (Total: {uploaded})")
                else:
                    print(f"✗ Error uploading batch {i//batch_size + 1}: {response.status_code} - {response.text}")
                
                time.sleep(1)  # Rate limiting
            except Exception as e:
                print(f"✗ Exception uploading batch: {e}")
        
        return uploaded

# ============================================
# MAIN EXECUTION
# ============================================

def main():
    print("=" * 60)
    print("📚 LIBRARY BOOK IMPORT SCRIPT")
    print("=" * 60)
    
    # Validate configuration
    if SUPABASE_URL == "YOUR_SUPABASE_URL" or SUPABASE_KEY == "YOUR_SUPABASE_ANON_KEY":
        print("❌ ERROR: Please update SUPABASE_URL and SUPABASE_KEY in the script!")
        return
    
    fetcher = BookDataFetcher()
    uploader = SupabaseUploader(SUPABASE_URL, SUPABASE_KEY)
    
    all_books = []
    
    # Define subjects/queries to fetch diverse books
    subjects = [
        'science_fiction', 'fantasy', 'mystery', 'thriller', 'romance',
        'history', 'biography', 'science', 'philosophy', 'psychology',
        'business', 'self_help', 'technology', 'programming', 'mathematics',
        'art', 'music', 'poetry', 'drama', 'adventure'
    ]
    
    google_queries = [
        'python programming', 'javascript', 'machine learning', 'data science',
        'web development', 'artificial intelligence', 'blockchain', 'cybersecurity',
        'classic literature', 'modern fiction', 'historical fiction', 'young adult',
        'personal development', 'entrepreneurship', 'leadership', 'marketing'
    ]
    
    print(f"\n📖 Fetching books from Open Library...")
    for subject in subjects[:10]:  # Limit to avoid too many requests
        print(f"  → Fetching {subject}...")
        books = fetcher.fetch_from_open_library(subject, limit=50)
        all_books.extend(books)
        if len(all_books) >= TARGET_BOOKS:
            break
    
    print(f"\n📚 Fetching books from Google Books...")
    for query in google_queries[:15]:  # Limit queries
        if len(all_books) >= TARGET_BOOKS:
            break
        print(f"  → Fetching '{query}'...")
        books = fetcher.fetch_from_google_books(query, max_results=40)
        all_books.extend(books)
    
    # Remove duplicates based on title and author
    print(f"\n🔄 Removing duplicates...")
    unique_books = []
    seen = set()
    for book in all_books:
        key = (book['title'].lower(), book['author'].lower())
        if key not in seen:
            seen.add(key)
            unique_books.append(book)
    
    # Limit to target number
    unique_books = unique_books[:TARGET_BOOKS]
    
    print(f"\n✓ Collected {len(unique_books)} unique books")
    
    # Save to CSV for backup
    print(f"\n💾 Saving to CSV backup...")
    df = pd.DataFrame(unique_books)
    df.to_csv('books_backup.csv', index=False)
    print(f"✓ Saved to books_backup.csv")
    
    # Upload to Supabase
    print(f"\n☁️  Uploading to Supabase...")
    uploaded_count = uploader.upload_books(unique_books)
    
    print("\n" + "=" * 60)
    print(f"✅ IMPORT COMPLETE!")
    print(f"   Total books uploaded: {uploaded_count}/{len(unique_books)}")
    print("=" * 60)

if __name__ == "__main__":
    # Install required packages (uncomment if running in Colab)
    # !pip install requests pandas
    
    main()
