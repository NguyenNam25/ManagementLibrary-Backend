const express = require("express");
const router = express.Router();
const { checkTokenAuthen } = require('../middleware/auth');
const { checkRoles } = require('../middleware/checkrole');
const upload = require('../middleware/multer.js');

const {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
  getLatestBooks,
  getPopularBooks
} = require("../controllers/book.controller.js");

// Public routes (no auth needed)
router.get("/latest", getLatestBooks);
router.get("/popular", getPopularBooks);
router.get("/", getBooks);
router.get("/:id", getBook);


// Protected routes (auth required)
router.post("/", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), upload.single('image'), addBook);
router.put("/:id", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), upload.single('image'), updateBook);
router.delete("/:id", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), deleteBook);

module.exports = router;
