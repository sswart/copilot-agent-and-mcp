const express = require('express');
const rateLimit = require('express-rate-limit');

function createFavoritesRouter({ usersFile, booksFile, readJSON, writeJSON, authenticateToken }) {
  const router = express.Router();
  const limitFavoriteMutations = rateLimit({
    windowMs: 60000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many favorite updates. Please try again later.' },
  });

  router.get('/', authenticateToken, (req, res) => {
    const users = readJSON(usersFile);
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const books = readJSON(booksFile);
    const favorites = books.filter(b => user.favorites.indexOf(b.id) !== -1);
    res.json(favorites);
  });

  router.post('/', limitFavoriteMutations, authenticateToken, (req, res) => {
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

  router.delete('/:bookId', limitFavoriteMutations, authenticateToken, (req, res) => {
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
