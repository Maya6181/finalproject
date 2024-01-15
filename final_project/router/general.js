const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    const matchingBooks = [];

    // Iterate through the 'books' object & check the author matches the one provided
    for (const key in books) {
        const book = books[key];
        if (book.author.toLowerCase() === requestedAuthor.toLowerCase()) {
            matchingBooks.push({ [key]: book });
        }
    }

    if (matchingBooks.length > 0) {
        res.status(200).json({ books: matchingBooks });
    } else {
        res.status(404).json({ message: 'No books found for the specified author.' });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const requestedTitle = req.params.title;
    const matchingBooks = [];

    // Iterate through the 'books' object & check the title matches the one provided
    for (const key in books) {
        const book = books[key];
        if (book.title.toLowerCase() === requestedTitle.toLowerCase()) {
            matchingBooks.push({ [key]: book });
        }
    }

    if (matchingBooks.length > 0) {
        res.status(200).json({ books: matchingBooks });
    } else {
        res.status(404).json({ message: 'No books found for the specified title.' });
    }
});

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required for registration.' });
        return;
    }

    // Check if the username already exists
    if (isValid(username)) {
        res.status(409).json({ message: 'Username already exists. Choose a different username.' });
        return;
    }

    // Register the new user
    users[username] = { password };

    res.status(201).json({ message: 'User registered successfully.' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        const bookReviews = books[isbn].reviews;
        res.status(200).json({ reviews: bookReviews });
    } else {
        res.status(404).json({ message: 'No reviews found for the specified ISBN.' });
    }
});
// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });
  
module.exports.general = public_users;
