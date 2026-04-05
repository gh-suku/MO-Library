import React, { useState } from 'react';
import { BookPlus, Mail, User, BookOpen, FileText, CheckCircle } from 'lucide-react';

export default function BookRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bookTitle: '',
    author: '',
    additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formspreeEndpoint || formspreeEndpoint === 'YOUR_FORMSPREE_ENDPOINT_HERE') {
      setError('Formspree endpoint not configured. Please add VITE_FORMSPREE_ENDPOINT to your .env file');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          bookTitle: formData.bookTitle,
          author: formData.author,
          additionalInfo: formData.additionalInfo,
          _subject: `New Book Request: ${formData.bookTitle}`,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          bookTitle: '',
          author: '',
          additionalInfo: '',
        });
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <BookPlus className="mx-auto text-primary mb-4" size={48} />
          <h1 className="text-3xl font-bold mb-2">Request a <span className="gradient-text">Book</span></h1>
          <p className="text-gray-600 dark:text-gray-300">
            Can't find the book you're looking for? Request it and we'll try to add it to our collection!
          </p>
        </div>

        {success && (
          <div className="glass-effect border border-primary/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold mb-1">Request Submitted!</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Thank you for your request. We'll review it and get back to you via email soon.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-effect border border-secondary/30 rounded-lg p-4 mb-6">
            <p className="text-secondary">{error}</p>
          </div>
        )}

        <div className="glass-effect rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background-light border border-gray-700 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background-light border border-gray-700 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="your.email@example.com"
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                We'll use this to notify you about your request
              </p>
            </div>

            {/* Book Title Field */}
            <div>
              <label htmlFor="bookTitle" className="block text-sm font-semibold mb-2">
                Book Title
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="bookTitle"
                  name="bookTitle"
                  value={formData.bookTitle}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background-light border border-gray-700 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter the book title"
                />
              </div>
            </div>

            {/* Author Field */}
            <div>
              <label htmlFor="author" className="block text-sm font-semibold mb-2">
                Author Name
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background-light border border-gray-700 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter the author's name"
                />
              </div>
            </div>

            {/* Additional Info Field */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-semibold mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-background-light border border-gray-700 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
                placeholder="Any additional details like ISBN, edition, publisher, or why you need this book..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 glass-effect border border-primary/30 rounded-lg p-4">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Your request will be sent to the library admin</li>
            <li>• We'll review the availability and feasibility</li>
            <li>• You'll receive an email response within 3-5 business days</li>
            <li>• If approved, we'll notify you when the book is available</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
