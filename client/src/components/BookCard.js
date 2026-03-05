import React from 'react';
import { useNavigate } from 'react-router-dom';
import { booksAPI } from '../api';
import { Heart, Trash2, BookOpen } from 'lucide-react';

const BookCard = ({ book, onDeleted }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(book.isFavorite);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await booksAPI.updateBook(book._id, { isFavorite: !isFavorite });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Favori güncellenemedi:', err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      try {
        await booksAPI.deleteBook(book._id);
        onDeleted?.();
      } catch (err) {
        console.error('Kitap silinemedi:', err);
      }
    }
  };

  return (
    <div
      onClick={() => navigate(`/read/${book._id}`)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden group"
    >
      {/* Cover Image */}
      <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-48 flex items-center justify-center relative overflow-hidden">
        <BookOpen className="text-white" size={48} />
        {isFavorite && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-white rounded-full p-1">
            ⭐
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 truncate">{book.author}</p>

        {/* Category */}
        <div className="mt-2 mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            {book.category}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <button
            onClick={handleToggleFavorite}
            className="flex-1 p-2 rounded hover:bg-gray-100 transition flex items-center justify-center gap-1 text-sm"
          >
            <Heart
              size={16}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 p-2 rounded hover:bg-gray-100 transition flex items-center justify-center gap-1 text-sm text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
