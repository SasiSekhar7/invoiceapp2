import React from 'react';

const SelectedBooksTable = ({ selectedBooks, onDeleteBook }) => {
  return (
    <div className="selected-books">
      <h2>Selected Books:</h2>
      <table className="book-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>GBL</th>
            <th>Total Quantity</th>
            <th>Rate</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.book['name']}</td>
              <td>{book.quantity}</td>
              <td>{book.quantity * book.bundleQuantity}</td>
              <td>{book.rate}</td>
              <td>{book.quantity * book.rate * book.bundleQuantity}</td>
              <td>
                <button onClick={() => onDeleteBook(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SelectedBooksTable;
