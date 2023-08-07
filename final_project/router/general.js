const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User succesfully registered." });
    } else {
      return res.status(404).json({ message: "User already exist." });
    }
  } else {
    return res
      .status(404)
      .json({ message: "Unable to register user. Check validations." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  res.send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let list = [];

  for (let [key, book] of Object.entries(books)) {
    if (book.author === author) {
      list.push(book);
    }
  }

  if (list) {
    res.send(JSON.stringify(list, null, 5));
  } else {
    res.send("No books found.");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let list = [];

  for (let [key, book] of Object.entries(books)) {
    if (book.title === title) {
      list.push(book);
    }
  }

  if (list) {
    res.send(JSON.stringify(list, null, 5));
  } else {
    res.send("No books found.");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn].review) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.send("No reviews written for this book.");
  }
});

module.exports.general = public_users;
