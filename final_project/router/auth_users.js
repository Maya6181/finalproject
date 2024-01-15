const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username) => {
    // Write code to check if the username is valid
    // For example, you may check if the username exists in your records
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    // Write code to check if username and password match the one we have in records
    // For example, you may check if the provided username and password match any user in your records
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required for login.' });
    }

    // Check if the username exists in records
    if (!isValid(username)) {
        return res.status(404).json({ message: 'Username not found. Please register.' });
    }

    // Check if the provided username and password match
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });

    // Save user credentials for the session as a JWT
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: 'Login successful.', accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.user.username; // Get username from the session
    const isbn = req.params.isbn;
    const review = req.query.review;

    // Check if the review is provided
    if (!review) {
        return res.status(400).json({ message: 'Review is required.' });
    }

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found.' });
    }

    // Check if the book already has a review from the current user
    if (!books[isbn].reviews[username]) {
        // If no review exists, add a new review
        books[isbn].reviews[username] = review;
    } else {
        // If a review already exists, modify the existing review
        books[isbn].reviews[username] = review;
    }

    return res.status(200).json({ message: 'Review added or modified successfully.' });

  });
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.user.username; // Get username from the session
    const isbn = req.params.isbn;

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found.' });
    }

    // Check if the book has a review from the current user
    if (books[isbn].reviews[username]) {
        // If a review exists, delete it
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: 'Review deleted successfully.' });
    } else {
        // If no review exists, return a message
        return res.status(404).json({ message: 'Review not found.' });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
