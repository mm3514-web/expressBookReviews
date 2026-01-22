const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            username: username
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60*60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "Login successful!" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const reviewText = req.query.review || req.body.review;

    /**
     * WHY req.user.username?
     * We use 'req.user' because it was populated by the authentication middleware 
     * after successfully verifying the JWT. This is more secure than 'req.session' 
     * alone because it ensures the username is cryptographically verified.
     * verified in index.js middleware:
     * jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => 
     */
    const username = req.user.username; 

    if (!reviewText) {
        return res.status(400).json({ message: "Review content is required" });
    }

    const book = books[isbn];
    if (book) {
        // Use the username as a key so each user only has one review per book
        book.reviews[username] = reviewText;
        return res.status(200).json({ message: "Review successfully posted/updated" });
    }
    
    return res.status(404).json({ message: "Book not found" });

  } catch (error) {
    return res.status(500).json({ message: "Error processing review" });
  }
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!username) return res.status(401).json({ message: 'Login required' });

    const book = books[isbn];
    if (book) {
        // Use the username as a key so each user only has one review per book
        delete book.reviews[username];
        return res.status(200).json({ message: `Review by user ${username} successfully deleted` });
    }
    
    return res.status(404).json({ message: 'Book not found' });

  } catch (error) {
    return res.status(500).json({ message: "Error processing review" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
