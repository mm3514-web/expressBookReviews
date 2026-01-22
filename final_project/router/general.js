const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ============================================================================
// USER REGISTRATION
// ============================================================================
public_users.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Basic Validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // 2. Simulate async check (for future database compatibility)
    const usersList = await new Promise((resolve) => resolve(users));

    // 3. Existence Check
    const userExists = usersList.some((u) => u.username === username);
    
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 4. SECURITY NOTE: In a real app, you would hash the password here
    // Example: const hashedPassword = await bcrypt.hash(password, 10);
    
    users.push({ 
        username: username, 
        password: password // In real life, use hashedPassword
    });

    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error during registration" });
  }
});

// ============================================================================
// TASK 10: Get all books (Base route + Async-Await with Axios)
// ============================================================================

// Base route - Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Wrap in promise for consistency with async pattern
    const allBooks = await new Promise((resolve) => resolve(books));
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// TASK 10: Using Axios to call the base route
public_users.get('/server/asyncbooks', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching books via Axios", 
      error: error.message 
    });
  }
});

// ============================================================================
// TASK 11: Get book by ISBN (Base route + Async-Await with Axios)
// ============================================================================

// Base route - Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Await the promise to get the book object
    const allBooks = await new Promise((resolve) => resolve(books));
    const book = allBooks[isbn];

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ 
        message: `Book with ISBN ${isbn} not found` 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching book by ISBN",
      error: error.message 
    });
  }
});

// TASK 11: Using Axios to call the ISBN route
public_users.get('/server/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ 
        message: `Book with ISBN ${isbn} not found via Axios` 
      });
    }
    return res.status(500).json({ 
      message: "Error fetching book details via Axios", 
      error: error.message 
    });
  }
});

// ============================================================================
// TASK 12: Get books by Author (Base route + Async-Await with Axios)
// ============================================================================

// Base route - Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const authorName = req.params.author;
    
    // Await the books data
    const allBooks = await new Promise((resolve) => resolve(books));
    
    // Filter books by author
    const filteredBooks = Object.keys(allBooks)
      .filter(key => allBooks[key].author === authorName)
      .map(key => allBooks[key]);

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ 
        message: `No books found by author: ${authorName}` 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      message: "Error fetching books by author",
      error: error.message 
    });
  }
});

// TASK 12: Using Axios to call the author route
public_users.get('/server/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ 
        message: `No books found by author: ${author} via Axios` 
      });
    }
    return res.status(500).json({ 
      message: "Error fetching book details via Axios", 
      error: error.message 
    });
  }
});

// ============================================================================
// TASK 13: Get books by Title (Base route + Async-Await with Axios)
// ============================================================================

// Base route - Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const titleParam = req.params.title;
    
    // Await the books data
    const allBooks = await new Promise((resolve) => resolve(books));
    
    // Filter books by title
    const filteredBooks = Object.keys(allBooks)
      .filter(key => allBooks[key].title === titleParam)
      .map(key => allBooks[key]);

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ 
        message: `No books found with title: ${titleParam}` 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      message: "Error fetching books by title",
      error: error.message 
    });
  }
});

// TASK 13: Using Axios to call the title route
public_users.get('/server/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ 
        message: `No books found with title: ${title} via Axios` 
      });
    }
    return res.status(500).json({ 
      message: "Error fetching book details via Axios", 
      error: error.message 
    });
  }
});

// ============================================================================
// BOOK REVIEWS
// ============================================================================

// Get book review by ISBN
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Await the promise to get the book object
    const allBooks = await new Promise((resolve) => resolve(books));
    const book = allBooks[isbn];

    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ 
        message: `Book with ISBN ${isbn} not found` 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching book reviews",
      error: error.message 
    });
  }
});

module.exports.general = public_users;