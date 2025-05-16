const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Book Schema
const bookSchema = new mongoose.Schema({
    bookName: String,
    bookAuthor: String,
    bookPages: Number,
    bookPrice: Number,
    bookState: String
});

const Book = mongoose.model("Book", bookSchema);

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Home Route - Display Books
app.get("/", async (req, res) => {
    const books = await Book.find();
    res.render("home", { data: books });
});

// Add Book
app.post("/", async (req, res) => {
    const newBook = new Book({
        bookName: req.body.bookName,
        bookAuthor: req.body.bookAuthor,
        bookPages: req.body.bookPages,
        bookPrice: req.body.bookPrice,
        bookState: "Available"
    });

    await newBook.save();
    res.redirect("/");
});

// Issue Book
app.post("/issue", async (req, res) => {
    await Book.updateOne({ bookName: req.body.bookName }, { bookState: "Issued" });
    res.redirect("/");
});

// Return Book
app.post("/return", async (req, res) => {
    await Book.updateOne({ bookName: req.body.bookName }, { bookState: "Available" });
    res.redirect("/");
});

// Delete Book
app.post("/delete", async (req, res) => {
    await Book.deleteOne({ bookName: req.body.bookName });
    res.redirect("/");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
