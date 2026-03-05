import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import UploadModal from '../components/UploadModal';
import { Plus, Search, Filter } from 'lucide-react';

const Library = () => {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await booksAPI.getBooks({
        search: search || undefined,
        category: category || undefined,
        favorite: favorite || undefined
      });
      setBooks(res.data);
    } catch (err) {
      console.error('Kitaplar yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, category, favorite]);

  const handleBookDeleted = () => {
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">📚 Kütüphanem</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              {user?.name}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Upload Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="mb-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} /> PDF Yükle
        </button>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ara
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Kitap adı veya yazar ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Kategoriler</option>
                <option value="Kurgu">Kurgu</option>
                <option value="Bilim Kurgu">Bilim Kurgu</option>
                <option value="Kişisel Gelişim">Kişisel Gelişim</option>
                <option value="Teknik">Teknik</option>
                <option value="İş">İş</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            <button
              onClick={() => setFavorite(!favorite)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                favorite
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              ⭐ Favori
            </button>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">Henüz kitap eklenmedi</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              İlk Kitabını Yükle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDeleted={handleBookDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={() => {
            setShowUploadModal(false);
            fetchBooks();
          }}
        />
      )}
    </div>
  );
};

export default Library;
