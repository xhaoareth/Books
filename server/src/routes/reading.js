const express = require('express');
const readingController = require('../controllers/readingController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Tüm işlemler kimlik doğrulaması gerektirir
router.use(authMiddleware);

// Okuma ilerlemeğini getir ve güncelle
router.get('/:bookId/progress', readingController.getProgress);
router.put('/:bookId/progress', readingController.updateProgress);

// Yer imleri
router.post('/:bookId/bookmarks', readingController.addBookmark);
router.delete('/:bookId/bookmarks/:bookmarkId', readingController.removeBookmark);

// İstatistikler
router.get('/stats/all', readingController.getStatistics);

module.exports = router;
