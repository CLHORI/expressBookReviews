const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"Carl","password":"Kuh"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
//only registered users can login
regd_users.post("/login", (req,res) => {
    // for testing

    const username = req.body.username;
    const password = req.body.password;
    //const username = "Carl";
    //const password = "Kuh";
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });
  
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const writer =  req.session.authorization.username;
    if (book) 
    {
        const review = books[isbn].reviews[writer];
        if (review)
        {
            return res.status(200).json({ message: "Review *"+ review +"* from *" + writer + "* was deleted successfully"});
        }
        else
        {
            return res.status(404).json({ message: "Review not found" });
        } 
    }  
    else 
    {
        return res.status(404).json({ message: "Book not found" });
    }
});
    // Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const writer =  req.session.authorization.username;
  console.log("Writer: " + writer);
  //sdlkfjsdlf
  if (books[isbn]) {
    books[isbn].reviews[writer] = review;
    return res.status(200).json({ message: "Review *"+ review +"* was added successfully by User:"+ writer });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
