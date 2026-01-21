const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Basic Validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // 2. Simulate async check (for future database compatibility)
    const usersList = await new Promise((resolve) => resolve(users));

    // 3. Existence Check (Using .some() is slightly faster than .find() for booleans)
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

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// TASK 10: The Axios "Client" (Call this one to test)
public_users.get('/server/asynbooks', async function (req, res) {
    try {
        // This calls the ROUTE ABOVE, so there is no loop!
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
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

// TASK 11: Get book details based on ISBN using Async-Await with Axios
public_users.get('/server/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        /** * Path B Logic: 
         * This route acts as a client. It calls the existing public GET /isbn/:isbn 
         * route using Axios. This demonstrates async-await and avoids infinite recursion.
         */
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        
        // Axios wraps the actual JSON response in the .data property
        const bookDetails = response.data;

        return res.status(200).json(bookDetails);
    } catch (error) {
        // Handle cases where the internal call fails (e.g., 404 or server down)
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "Book not found via Axios" });
        }
        return res.status(500).json({ 
            message: "Error fetching book details via Axios", 
            error: error.message 
        });
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

// TASK 11: Get book details based on ISBN using Async-Await with Axios
public_users.get('/server/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        /** * Path B Logic: 
         * This route acts as a client. It calls the existing public GET /author/:author 
         * route using Axios. This demonstrates async-await and avoids infinite recursion.
         */
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        
        // Axios wraps the actual JSON response in the .data property
        const bookDetails = response.data;

        return res.status(200).json(bookDetails);
    } catch (error) {
        // Handle cases where the internal call fails (e.g., 404 or server down)
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "author not found via Axios" });
        }
        return res.status(500).json({ 
            message: "Error fetching book details via Axios", 
            error: error.message 
        });
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
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    // 1. Await the promise to get the book object
    const allBooks = await new Promise((resolve) => resolve(books));

    const book = allBooks[isbn];

    if(book)
    {
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
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

module.exports.general = public_users;
