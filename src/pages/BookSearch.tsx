import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Book } from '../lib/supabase';
import { Search, BookOpen, CheckCircle, XCircle } from 'lucide-react';

export default function BookSearch() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterAvailable, setFilterAvailable] = useState<'all' | 'available' | 'unavailable'>('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchQuery, filterAvailable, books]);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('title', { ascending: true });

    if (data && !error) {
      setBooks(data);
      setFilteredBooks(data);
    }
    setLoading(false);
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn?.toLowerCase().includes(query)
      );
    }

    // Filter by availability
    if (filterAvailable === 'available') {
      filtered = filtered.filter((book) => book.is_available && book.available_copies > 0);
    } else if (filterAvailable === 'unavailable') {
      filtered = filtered.filter((book) => !book.is_available || book.available_copies === 0);
    }

    setFilteredBooks(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Books</h1>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterAvailable('all')}
                className={`px-4 py-2 rounded-lg ${
                  filterAvailable === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterAvailable('available')}
                className={`px-4 py-2 rounded-lg ${
                  filterAvailable === 'available'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setFilterAvailable('unavailable')}
                className={`px-4 py-2 rounded-lg ${
                  filterAvailable === 'unavailable'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Unavailable
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
          </p>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No books available in the library yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    {book.isbn && (
                      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                    )}
                  </div>
                  <div>
                    {book.is_available && book.available_copies > 0 ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <XCircle className="text-red-600" size={24} />
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Copies:</span>
                    <span className="font-semibold">{book.total_copies}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Available:</span>
                    <span
                      className={`font-semibold ${
                        book.available_copies > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {book.available_copies}
                    </span>
                  </div>

                  <div
                    className={`text-center py-2 rounded-lg font-semibold ${
                      book.is_available && book.available_copies > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.is_available && book.available_copies > 0
                      ? 'Available'
                      : 'Not Available'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
