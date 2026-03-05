const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Bilinmeyen Yazar'
  },
  category: {
    type: String,
    enum: ['Kurgu', 'Bilim Kurgu', 'Kişisel Gelişim', 'Teknik', 'İş', 'Diğer'],
    default: 'Diğer'
  },
  description: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  pageCount: {
    type: Number,
    default: 0
  },
  pdfUrl: {
    type: String
  },
  thumbnailUrl: {
    type: String
  },
  extractedText: {
    type: String,
    default: ''
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema);
