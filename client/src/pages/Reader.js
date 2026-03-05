import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksAPI, readingAPI } from '../api';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, Bookmark, Home } from 'lucide-react';

// Worker'ı ayarla
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Reader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  // Kitap ve ilerlemeyi yükle
  useEffect(() => {
    const loadBook = async () => {
      try {
        const [bookRes, progressRes] = await Promise.all([
          booksAPI.getBook(bookId),
          readingAPI.getProgress(bookId)
        ]);

        setBook(bookRes.data);
        const prog = progressRes.data;
        setProgress(prog);
        setCurrentPage(prog.currentPage || 1);
        setBookmarks(prog.bookmarks || []);

        // PDF yükle
        const pdf = await pdfjsLib.getDocument(bookRes.data.pdfUrl).promise;
        setPdf(pdf);
        setNumPages(pdf.numPages);
      } catch (err) {
        setError('Kitap yüklenemedi');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId]);

  // İlerlemeyi güncelle
  const updateProgress = async (page) => {
    try {
      await readingAPI.updateProgress(bookId, {
        currentPage: page,
        totalPages: numPages
      });
    } catch (err) {
      console.error('İlerleme güncellenemedi:', err);
    }
  };

  const handlePreviousPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    updateProgress(newPage);
  };

  const handleNextPage = () => {
    const newPage = Math.min(numPages, currentPage + 1);
    setCurrentPage(newPage);
    updateProgress(newPage);
  };

  const handleAddBookmark = async () => {
    try {
      const res = await readingAPI.addBookmark(bookId, {
        page: currentPage,
        note: `Sayfa ${currentPage}`
      });
      setBookmarks(res.data.bookmarks);
    } catch (err) {
      console.error('Yer imi eklenemedi:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <p className="text-white">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Kütüphaneye Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <Home size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg">{book?.title}</h1>
            <p className="text-sm text-gray-400">{book?.author}</p>
          </div>
        </div>
        <div className="text-sm">
          Sayfa {currentPage} / {numPages} (
          {Math.round((currentPage / numPages) * 100)}%)
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-800 flex items-center justify-center p-4">
        {pdf && (
          <PDFPage
            pdf={pdf}
            pageNumber={currentPage}
            onLoadSuccess={(page) => {
              // PDF sayfa yüklendi
            }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="p-2 hover:bg-gray-800 rounded disabled:opacity-50"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleAddBookmark}
            className="p-2 hover:bg-gray-800 rounded flex items-center gap-2"
          >
            <Bookmark size={20} />
            <span className="text-sm">
              {bookmarks.some(b => b.page === currentPage) ? 'İşaretli' : 'İşaretle'}
            </span>
          </button>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === numPages}
          className="p-2 hover:bg-gray-800 rounded disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

// PDF Sayfa Bileşeni
const PDFPage = ({ pdf, pageNumber }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Sayfa renderlenemedi:', err);
      }
    };

    renderPage();
  }, [pdf, pageNumber]);

  return <canvas ref={canvasRef} className="max-w-full max-h-full shadow-lg" />;
};

export default Reader;
