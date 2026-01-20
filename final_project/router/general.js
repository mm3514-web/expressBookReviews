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
public_users.get('/author/:author', async function (req, res) {
  try {
    const authorName = req.params.author;
    
    // 1. Await the books data
    const allBooks = await new Promise((resolve) => resolve(books));
    
    // 2. Filter the keys of the object to find books by that author
    const keys = Object.keys(allBooks);
    const filteredBooks = [];

    keys.forEach(key => {
        if (allBooks[key].author === authorName) {
            filteredBooks.push(allBooks[key]);
        }
    });

    // 3. Check if we found any books
    if (filteredBooks.length > 0) {
        return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
   try {
    const title = req.params.title;
    
    // 1. Await the books data
    const allBooks = await new Promise((resolve) => resolve(books));
    
    // 2. Filter the keys of the object to find books by that author
    const keys = Object.keys(allBooks);
    const filteredBooks = [];

    keys.forEach(key => {
        if (allBooks[key].title === req.params.title) {
            filteredBooks.push(allBooks[key]);
        }
    });

    // 3. Check if we found any books
    if (filteredBooks.length > 0) {
        return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found by this title" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
