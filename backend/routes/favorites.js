const express = require("express");

function createFavoritesRouter({
  usersFile,
  booksFile,
  readJSON,
  writeJSON,
  authenticateToken,
}) {
  const router = express.Router();

  router.get("/", authenticateToken, (req, res) => {
    const users = readJSON(usersFile);
    const user = users.find((u) => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "User not found" });
    const books = readJSON(booksFile);
    // generated-by-copilot: enrich each book with its associated comment
    const favorites = books
      .filter((b) => user.favorites.some((f) => f.bookId === b.id))
      .map((b) => ({
        ...b,
        comment: user.favorites.find((f) => f.bookId === b.id).comment,
      }));
    res.json(favorites);
  });

  router.post("/", authenticateToken, (req, res) => {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: "Book ID required" });
    const users = readJSON(usersFile);
    const user = users.find((u) => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.favorites.find((f) => f.bookId === bookId)) {
      user.favorites.push({ bookId, comment: "" });
      writeJSON(usersFile, users);
    }
    res.status(200).json({ message: "Book added to favorites" });
  });

  // generated-by-copilot: update the comment for a specific favorited book
  router.put("/:bookId", authenticateToken, (req, res) => {
    const { bookId } = req.params;
    const { comment } = req.body;
    const users = readJSON(usersFile);
    const user = users.find((u) => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "User not found" });
    const favorite = user.favorites.find((f) => f.bookId === bookId);
    if (!favorite)
      return res.status(404).json({ message: "Favorite not found" });
    favorite.comment = comment ?? "";
    writeJSON(usersFile, users);
    res.json({ bookId, comment: favorite.comment });
  });

  return router;
}

module.exports = createFavoritesRouter;
