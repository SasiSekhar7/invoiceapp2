
const InvoicesList= ({ books })=> {
    const totalAmount = books.reduce((total, book) => total + book.total, 0);
  
    return (
      <div>
        <h2>Invoices List:</h2>
        <ul>
          {books.map((invoice, index) => (
            <li key={index}>
              <strong>Client:</strong> {invoice.client},{' '}
              <strong>Total:</strong> {invoice.total}
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Book Name</th>
                    <th>Bundle Quantity</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Total</th> 
                  </tr>
                </thead>
                <tbody>
                  {invoice.books.map((book, bookIndex) => (
                    <tr key={bookIndex}>
                      <td>{book.book.name}</td>
                      <td>{book.book.bundleQuantity}</td>
                      <td>{book.quantity}</td>
                      <td>{book.rate}</td>
                      <td>{book.quantity * book.rate * book.book.bundleQuantity}</td> {/* Calculate and display total */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </li>
          ))}
        </ul>
        <p>Total Amount: {totalAmount}</p>
      </div>
    );
  }
  export default InvoicesList