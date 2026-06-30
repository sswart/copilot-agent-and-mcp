const express = require('express');

function createFavoritesRouter({ usersFile, booksFile, readJSON, writeJSON, authenticateToken }) {
  const router = express.Router();
  const mutationRequests = new Map();

  function limitFavoriteMutations(req, res, next) {
    const key = req.user.username;
    const now = Date.now();
    const current = mutationRequests.get(key);

    if (!current || now - current.startedAt >= 60000) {
      mutationRequests.set(key, { count: 1, startedAt: now });
      return next();
    }

    if (current.count >= 30) {
      return res.status(429).json({ message: 'Too many favorite updates. Please try again later.' });
    }

    current.count += 1;
    mutationRequests.set(key, current);
    next();
  }

  router.get('/', authenticateToken, (req, res) => {
    const users = readJSON(usersFile);
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const books = readJSON(booksFile);
    const favorites = books.filter(b => user.favorites.indexOf(b.id) !== -1);
    res.json(favorites);
  });

  router.post('/', authenticateToken, limitFavoriteMutations, (req, res) => {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'Book ID required' });
    const users = readJSON(usersFile);
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const books = readJSON(booksFile);
    const favoriteBook = books.find(book => book.id === bookId);
    if (!favoriteBook) return res.status(404).json({ message: 'Book not found' });
    if (user.favorites.indexOf(bookId) === -1) {
      user.favorites.push(bookId);
      writeJSON(usersFile, users);
    }
    res.status(200).json({ message: 'Book added to favorites', book: favoriteBook });
  });

  router.delete('/:bookId', authenticateToken, limitFavoriteMutations, (req, res) => {
    const { bookId } = req.params;
    const users = readJSON(usersFile);
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const favoriteIndex = user.favorites.indexOf(bookId);
    if (favoriteIndex === -1) {
      return res.status(404).json({ message: 'Book not found in favorites' });
    }

    user.favorites.splice(favoriteIndex, 1);
    writeJSON(usersFile, users);
    res.status(200).json({ message: 'Book removed from favorites' });
  });

  return router;
}

module.exports = createFavoritesRouter;
