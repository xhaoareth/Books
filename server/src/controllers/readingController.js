const ReadingProgress = require('../models/ReadingProgress');

// Okuma ilerlemeğini getir
exports.getProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    let progress = await ReadingProgress.findOne({
      userId: req.userId,
      bookId
    });
    
    if (!progress) {
      progress = new ReadingProgress({
        userId: req.userId,
        bookId,
        currentPage: 1,
        totalPages: 0,
        percentageRead: 0
      });
      await progress.save();
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Okuma ilerlemeğini güncelle
exports.updateProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { currentPage, totalPages } = req.body;
    
    const percentageRead = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
    
    let progress = await ReadingProgress.findOneAndUpdate(
      { userId: req.userId, bookId },
      {
        currentPage,
        totalPages,
        percentageRead,
        lastReadAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json({
      message: 'İlerleme güncellendi',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Yer imi ekle
exports.addBookmark = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page, note } = req.body;
    
    let progress = await ReadingProgress.findOne({
      userId: req.userId,
      bookId
    });
    
    if (!progress) {
      progress = new ReadingProgress({
        userId: req.userId,
        bookId,
        bookmarks: []
      });
    }
    
    progress.bookmarks.push({
      page,
      note: note || ''
    });
    
    await progress.save();
    
    res.status(201).json({
      message: 'Yer imi eklendi',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Yer imi sil
exports.removeBookmark = async (req, res) => {
  try {
    const { bookId, bookmarkId } = req.params;
    
    const progress = await ReadingProgress.findOneAndUpdate(
      { userId: req.userId, bookId },
      { $pull: { bookmarks: { _id: bookmarkId } } },
      { new: true }
    );
    
    res.json({
      message: 'Yer imi silindi',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Tüm okuma istatistiklerini getir
exports.getStatistics = async (req, res) => {
  try {
    const progresses = await ReadingProgress.find({ userId: req.userId });
    
    const totalBooks = progresses.length;
    const completedBooks = progresses.filter(p => p.percentageRead === 100).length;
    const averageProgress = progresses.length > 0
      ? progresses.reduce((sum, p) => sum + p.percentageRead, 0) / progresses.length
      : 0;
    
    res.json({
      totalBooks,
      completedBooks,
      averageProgress: Math.round(averageProgress),
      recentlyRead: progresses
        .sort((a, b) => b.lastReadAt - a.lastReadAt)
        .slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};
