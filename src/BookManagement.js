import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookManagement() {
  // State variables
  const baseURL = 'https://invoiceapp2-api.onrender.com';
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    name: '',
    bundleQuantity: 0,
    rate: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch initial book data from the server when the component mounts
  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = `${baseURL}/books`;

    // Make a GET request to fetch books
    axios
      .get(apiUrl)
      .then((response) => {
        setBooks(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false); // Set loading to false if an error occurs
      });
  }, []);

  // Handle input changes in the "Add Book" form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({ ...newBook, [name]: value });
  };

  // Handle submission of the "Add Book" form
  const handleSubmit = (event) => {
    event.preventDefault();

    // Define the API endpoint URL
    const apiUrl = `${baseURL}/books`;

    // Make a POST request to create a new book
    axios
      .post(apiUrl, newBook)
      .then((response) => {
        setBooks([...books, response.data]);
        // Clear the form fields
        setNewBook({
          name: '',
          bundleQuantity: 0,
          rate: 0,
        });
      })
      .catch((error) => {
        console.error('Error creating book:', error);
      });
  };

  // Handle book deletion
  const handleDelete = (bookId) => {
    // Define the API endpoint URL
    const apiUrl = `${baseURL}/books/${bookId}`;

    // Make a DELETE request to delete the book from the server
    axios
      .delete(apiUrl)
      .then(() => {
        // Remove the book from the books array
        setBooks(books.filter((book) => book._id !== bookId));
      })
      .catch((error) => {
        console.error('Error deleting book:', error);
      });
  };

  const handleSearch = () => {
    // Implement book search logic here

    // Create a copy of the original books array to avoid modifying the original data
    const filteredBooks = [...books];

    // Filter the books based on the search term
    const searchResults = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update the state with the search results
    setBooks(searchResults);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsEditing(true);
  };

  const handleEditingInputChange = (event) => {
    const { name, value } = event.target;
    setEditingBook({
      ...editingBook,
      [name]: value,
    });
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    // Define the API endpoint URL for updating a book
    const apiUrl = `${baseURL}/books/${editingBook._id}`;

    // Make a PUT request to update the book
    axios
      .put(apiUrl, editingBook)
      .then((response) => {
        // Update the book list with the edited data
        const updatedBooks = books.map((book) =>
          book._id === editingBook._id ? response.data : book
        );
        setBooks(updatedBooks);

        // Reset editing state
        setIsEditing(false);
        setEditingBook(null);
      })
      .catch((error) => {
        console.error('Error updating book:', error);
      });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingBook(null);
  };

  return (
    <div>
      <h2>Book Management</h2>
      <button onClick={() => setShowAddBookForm(true)} className="add-button">
        Add Book
      </button>
      {showAddBookForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Book Name"
              value={newBook.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="bundleQuantity"
              placeholder="Bundle Quantity"
              value={newBook.bundleQuantity}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="rate"
              placeholder="Rate"
              value={newBook.rate}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="add-button">
            Add Book
          </button>
          <button
            onClick={() => setShowAddBookForm(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Search for a book by name */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {isEditing && (
        <div>
          <div className="edit-form">
            <h3>Edit Book</h3>
            <form onSubmit={handleUpdate}>
              {/* Render form fields for editing */}
              <div className="form-group">
                <label htmlFor="name">Book Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editingBook.name}
                  onChange={handleEditingInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="bundleQuantity">Bundle Quantity:</label>
                <input
                  type="number"
                  name="bundleQuantity"
                  value={editingBook.bundleQuantity}
                  onChange={handleEditingInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rate">Rate:</label>
                <input
                  type="number"
                  name="rate"
                  value={editingBook.rate}
                  onChange={handleEditingInputChange}
                />
              </div>
              <div className="button-group">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button onClick={cancelEdit} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display the list of existing books or a message */}
      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Bundle Quantity</th>
              <th>Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.name}</td>
                <td>{book.bundleQuantity}</td>
                <td>{book.rate}</td>
                <td>
                  <div className="button-container">
                  <button
                      className="action-button"
                      onClick={() => handleEdit(book)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleDelete(book._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BookManagement;
