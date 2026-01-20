const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // 1. Await the promise to get the books object
    const allBooks = await new Promise((resolve) => resolve(books));
    
    // 2. Use JSON.stringify(object, replacer, space)
    // null = we don't want to filter any properties
    // 4 = we want 4 spaces of indentation for "pretty-print"
    res.status(200).send(JSON.stringify(allBooks, null, 4));

  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    // 1. Await the promise to get the book object
    const allBooks = await new Promise((resolve) => resolve(books));

    const book = allBooks[isbn];

    if(book)
    {
      return res.status(200).send(JSON.stringify(book, null, 4));
    }
    else
    {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  }
  catch (error) {
    res.status(500).json({ message: "Error fetching book isbn" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
