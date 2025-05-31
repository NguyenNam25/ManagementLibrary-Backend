const cloudinary = require("../middleware/cloudinary.js");
const Book = require("../models/book.model.js");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addBook = async (req, res) => {
  try {
    const book = await Book(req.body);
    if (req.file) {
      try {
        console.log(req.file);
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "Book",
        });
        console.log("Cloudinary result:", upload);
        book.image = upload.secure_url;

      } catch (err) {
        console.log(err);
      }
    }
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, quantity, status, description} = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (quantity !== undefined) book.quantity = quantity;
    if (status !== undefined) book.status = status;
    if (description !== undefined) book.description = description;

    if (req.file) {
      try {
        console.log(req.file);
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "Book",
        });
        console.log("Cloudinary result:", upload);
        book.image = upload.secure_url;

      } catch (err) {
        console.log(err);
      }
    }

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id, req.body);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ messafe: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLatestBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ yearOfPublication: -1 }) // Sắp xếp theo năm giảm dần
      .limit(4); // Lấy 4 sách đầu tiên

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPopularBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ borrowCount: -1}) // Phổ biến nhất và mới nhất
      .limit(4);

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
  getLatestBooks,
  getPopularBooks,
};
