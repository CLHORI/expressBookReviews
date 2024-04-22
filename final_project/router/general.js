const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username + " " + password);
    if (username && password) {
      
          if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });
  

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try{
        const data = await JSON.stringify(books, null, 4);
        res.send(data);
    } catch (error){ 
        res.status(500).send('An error occurred');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try{
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.send(book);
  } catch{
    res.status(500).send('An error occurred');
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const booksbyauthor = [];
        for (const id in books) {
            if (books.hasOwnProperty(id)) {
                if (books[id].author === author) {
                    booksbyauthor.push(books[id]);
                }
            }
        }
        if (booksbyauthor.length > 0) {
            res.json(booksbyauthor);
        } else {
            res.status(404).send(`No books found for author: ${author}`);
        }
    } catch {
        res.status(500).send('An error occurred');
    }
});

// Get all books based on title
public_users.get('/title/:title',function async (req, res) {
    try{
        const title = req.params.title;
        const booksbytitle = [];
        for (const id in books) {
            if (books.hasOwnProperty(id)) {
                if (books[id].title === title) {
                    booksbytitle.push(books[id]);
                }
            }
        }
        res.send(booksbytitle);
    }
    catch{
        res.status(500).send('An error occurred');
    }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    reviewsbyisbn = [];
    for (const id in books){
        if (books.hasOwnProperty(id)){
            if (id === isbn){
                const reviews = books[id].reviews;
                for (const id2 in reviews){
                    reviewsbyisbn.push(reviews[id2]);
                }
                
            }
        }
    }
    res.send(reviewsbyisbn);
});

module.exports.general = public_users;
