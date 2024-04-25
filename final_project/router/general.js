const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const user = req.body.user;
    const pwd = req.body.password;

    // Check if 'user' or 'password' is missing
    if (!user || !pwd) {
        return res.status(400).json({ error: "Both 'user' and 'password' are required." });
    }

    // Check if the user already exists
    const existingUser = users.find(existingUser => existingUser.username === user);
    if (existingUser) {
        return res.status(409).json({ error: "User already exists." });
    }

    // Add New user
    const newUser = {
        username: user,
        password: pwd,
    };
    users.push(newUser);
    return res.status(200).json({message: "New User added."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    return res.status(200).send(JSON.stringify(filteredBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    return res.status(200).send(JSON.stringify(filteredBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn]['reviews'],null,4));
});

module.exports.general = public_users;
