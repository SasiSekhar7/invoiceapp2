import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Invoice from './Test';
import './App1.css';
import ClientManagement from './ClientManagement';
import TransporterManagement from './TransporterManagement';
import BookManagement from './BookManagement';

function App() {
  return (
    <div className="app-container">
      <div className="App">
      <div className="navbar">
        <h1 className="navbar-title">SRI KRISHNA Binding Works</h1>
        </div>
        <Router>
          <div>
            <nav className="navbar-buttons">
                  <Link to="/" className="navbar-button">Generate Invoice</Link>
                  <Link to="/clients" className="navbar-button">Manage Clients</Link>
                  <Link to="/transporters" className="navbar-button">Manage Transporters</Link>
                  <Link to="/books" className="navbar-button">Manage Books</Link>
            </nav>
            <Routes>
              <Route path="/" element={<Invoice />} />
              <Route path="/clients" element={<ClientManagement />} />
              <Route path="/transporters" element={<TransporterManagement />} />
              <Route path="/books" element={<BookManagement />} />
            </Routes>
          </div>
        </Router>
        {/* Your other content goes here */}
      </div>
    </div>
  );
}

export default App;
