const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    let username = req.body;
    let password = req.body;

    if(!username || !password){
        return res.status(404).json({message : "Username and Password are required"});

    }
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    // Add user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully!" });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  isbn = req.params.isbn;
  book = books[isbn] ;
  return res.send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookByAuthor = [];

  for(let isbn in books){
    if(books[isbn].author === author){
        bookByAuthor.push({isbn,...books[isbn]});
    }
  }
  if(bookByAuthor.length > 0){
    return res.json(bookByAuthor);
  }
  else{
    return res.status(404).json("No books found by this author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let bookByTitle = [];

    for(let isbn in books){
        if(books[isbn].title === title){
            bookByTitle.push({isbn,...books[isbn]});
        }
    }
    if(bookByTitle.length > 0){
        return res.json(bookByTitle);
    }
    else{
        return res.status(300).json({message: "No books found by title"});
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  if(books[isbn]){
    return res.json(books[isbn].reviews);
  }
  else{
    return res.status(300).json({message: "No book found"});
  }
});

module.exports.general = public_users;
