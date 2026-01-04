const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

/* =====================================================
   CREATE – Add a new book
   ===================================================== */
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: "Invalid book data" });
  }
});

/* =====================================================
   READ – Get all books
   ===================================================== */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   READ – Get books by category
   ===================================================== */
router.get("/category/:category", async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.category });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   READ – Get books published after a year
   ===================================================== */
router.get("/after/:year", async (req, res) => {
  try {
    const year = Number(req.params.year);
    const books = await Book.find({ publishedYear: { $gt: year } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE – Increase / Decrease available copies
   ===================================================== */
router.put("/copies/:id", async (req, res) => {
  try {
    const { change } = req.body;

    if (typeof change !== "number") {
      return res.status(400).json({ message: "Invalid update value" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies + change < 0) {
      return res
        .status(400)
        .json({ message: "Negative stock not allowed" });
    }

    book.availableCopies += change;
    await book.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE – Change category
   ===================================================== */
router.put("/category-update/:id", async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category required" });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { category },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   DELETE – Remove book if copies = 0
   ===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies !== 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete book with available copies" });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   TEST ROUTE (optional but helpful)
   ===================================================== */
router.get("/test", (req, res) => {
  res.send("Book routes working fine");
});

module.exports = router;
