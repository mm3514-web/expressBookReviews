require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:process.env.SESSION_SECRET,resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // 1. Check if the session and token exist
    if (req.session && req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Accessing the token from session

        // 2. Verify the JWT Token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (!err) {
                // 3. If valid, store user info in the request for later use
                req.user = user;
                next(); // Move to the next middleware or route handler
            } else {
                // 4. If token is expired or invalid
                return res.status(403).json({ message: "User not authenticated or session expired" });
            }
        });
    } else {
        // 5. If no token is found at all
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT = process.env.PORT;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));