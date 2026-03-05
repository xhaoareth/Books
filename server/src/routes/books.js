const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

const router = express.Router();

// Tüm işlemler kimlik doğrulaması gerektirir
router.use(authMiddleware);

// Kitapları listele ve ara
router.get('/', bookController.getBooks);

// Kitap yükle
router.post('/upload', upload.single('pdf'), bookController.uploadBook);

// Tek kitap getir, güncelle, sil
router.get('/:id', bookController.getBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
