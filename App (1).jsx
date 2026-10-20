
import React, { useState, useEffect } from "react";

// Child component receives title and author through props
function Book({ title, author }) {
  return (
    <div style={{
      border: "1px solid green",
      padding: "15px",
      margin: "10px",
      borderRadius: "8px"
    }}>
      <h3>Book Title: {title}</h3>
      <p>Author: {author}</p>
    </div>
  );
}

// Parent component
export default function App() {
  const [books, setBooks] = useState([
    { id: 1, title: "Wings of Fire", author: "A. P. J. Abdul Kalam" },
    { id: 2, title: "The Alchemist", author: "Paulo Coelho" }
  ]);

  const [notification, setNotification] = useState("");

  // Runs when the page loads
  useEffect(() => {
    console.log("Welcome to the Book Management System");
  }, []);

  // Runs when the number of books changes
  useEffect(() => {
    setNotification(
      books.length > 0
        ? `${books.length} book(s) available`
        : "No books available"
    );
  }, [books.length]);

  function removeBooks() {
    setBooks([]);
  }

  function addBook() {
    setBooks((previousBooks) => [
      ...previousBooks,
      {
        id: Date.now(),
        title: "New Book",
        author: "Unknown Author"
      }
    ]);
  }

  return (
    <div style={{ padding: "25px" }}>
      <h1>Book Management System</h1>

      <h2>
        {books.length > 0
          ? "Books Available"
          : "No Books Available"}
      </h2>

      {books.map((book) => (
        <Book
          key={book.id}
          title={book.title}
          author={book.author}
        />
      ))}

      <h3>Notification: {notification}</h3>

      <button onClick={addBook} style={{ marginRight: "10px" }}>
        Add Book
      </button>

      <button onClick={removeBooks}>
        Remove All Books
      </button>
    </div>
  );
}
