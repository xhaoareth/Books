const Book = require('../models/Book');
const ReadingProgress = require('../models/ReadingProgress');
const path = require('path');
const fs = require('fs');

// Tüm kitapları getir
exports.getBooks = async (req, res) => {
  try {
    const { category, search, favorite } = req.query;
    
    let query = { userId: req.userId };
    
    if (category) {
      query.category = category;
    }
    
    if (favorite === 'true') {
      query.isFavorite = true;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    const books = await Book.find(query).sort({ uploadedAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Tek kitap getir
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Erişim reddedildi' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kitap yükle
exports.uploadBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }

    const { title, author, category } = req.body;

    const book = new Book({
      userId: req.userId,
      title: title || path.parse(req.file.filename).name,
      author: author || 'Bilinmeyen Yazar',
      category: category || 'Diğer',
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      pdfUrl: `/uploads/${req.file.filename}`
    });

    await book.save();

    res.status(201).json({
      message: 'Kitap başarıyla yüklendi',
      book
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => { });
    }
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kitap bilgisini güncelle
exports.updateBook = async (req, res) => {
  try {
    const { title, author, category, description, isFavorite } = req.body;
    
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Erişim reddedildi' });
    }
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.description = description || book.description;
    book.isFavorite = isFavorite !== undefined ? isFavorite : book.isFavorite;
    book.updatedAt = Date.now();
    
    await book.save();
    
    res.json({
      message: 'Kitap güncellendi',
      book
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kitap sil
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Erişim reddedildi' });
    }
    
    // Dosyayı sil
    if (fs.existsSync(book.filePath)) {
      fs.unlinkSync(book.filePath);
    }
    
    // Okuma ilerlemesini sil
    await ReadingProgress.deleteMany({ bookId: book._id });
    
    // Kitabı sil
    await Book.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Kitap silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};
