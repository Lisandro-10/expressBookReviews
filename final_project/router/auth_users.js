const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let user = users.filter((user) => user.username === username);

  if (user.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean

  for (let user of users) {
    if (user.username === username && user.password === password) {
      return true;
    } else {
      return false;
    }
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );

      req.session.authorization = {
        accessToken,
        username,
      };

      return res
        .status(200)
        .json({ message: "User " + username + " logged in!" });
    } else {
      return res
        .status(208)
        .json({ message: "User not found. Register before loggin in." });
    }
  } else {
    return res
      .status(404)
      .json({ message: "User not logged in. Check validations." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  const book = books[isbn];

  if (!review) {
    return res.status(404).json({ message: "Review required." });
  } else {
    if (book.reviews[username]) {
      book.reviews[username] = review;
      return res.status(201).json({ message: "Review updated succesfully!" });
    }
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added succesfully!" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
