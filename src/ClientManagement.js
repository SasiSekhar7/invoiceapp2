import React, { useState, useEffect } from 'react';
import axios from 'axios';


function ClientManagement() {
  // State variables
  const baseURL = 'https://invoiceapp2-api.onrender.com';
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    shopName: '',
    ADRESS: '',
    CITY: '',
    district: '',
    pin: '',
    mobile: '',
    AGENT: '',
    booktype: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch initial client data from the server when the component mounts
  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = `${baseURL}/clients`;

    // Make a GET request to fetch clients
    axios
      .get(apiUrl)
      .then((response) => {
        setClients(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching clients:', error);
        setLoading(false); // Set loading to false if an error occurs
      });
  }, []);

  // Handle input changes in the "Add Client" form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewClient({ ...newClient, [name]: value });
  };

  // Handle submission of the "Add Client" form
  const handleSubmit = (event) => {
    event.preventDefault();

    // Define the API endpoint URL
    const apiUrl = `${baseURL}/clients`;

    // Make a POST request to create a new client
    axios
      .post(apiUrl, newClient)
      .then((response) => {
        setClients([...clients, response.data]);
        // Clear the form fields
        setNewClient({
          shopName: '',
          ADRESS: '',
          CITY: '',
          district: '',
          pin: '',
          mobile: '',
          AGENT: '',
          booktype: '',
        });
      })
      .catch((error) => {
        console.error('Error creating client:', error);
      });
  };

  // Handle client deletion
  const handleDelete = (clientId) => {
    // Define the API endpoint URL
    const apiUrl = `${baseURL}/clients/${clientId}`;

    // Make a DELETE request to delete the client from the server
    axios
      .delete(apiUrl)
      .then(() => {
        // Remove the client from the clients array
        setClients(clients.filter((client) => client._id !== clientId));
      })
      .catch((error) => {
        console.error('Error deleting client:', error);
      });
  };

  const handleSearch = () => {
    // Implement client search logic here
  
    // Create a copy of the original clients array to avoid modifying the original data
    const filteredClients = [...clients];
  
    // Filter the clients based on the search term
    const searchResults = filteredClients.filter((client) =>
      client.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Update the state with the search results
    setClients(searchResults);
  
  };
  const handleEdit = (client) => {
    setEditingClient(client);
    setIsEditing(true);
  };
  const handleEditingInputChange = (event) => {
    const { name, value } = event.target;
    setEditingClient({
      ...editingClient,
      [name]: value,
    });
  };
  const handleUpdate = (event) => {
    event.preventDefault();
  
    // Define the API endpoint URL for updating a client
    const apiUrl = `${baseURL}/clients/${editingClient._id}`;
  
    // Make a PUT request to update the client
    axios
      .put(apiUrl, editingClient)
      .then((response) => {
        // Update the client list with the edited data
        const updatedClients = clients.map((client) =>
          client._id === editingClient._id ? response.data : client
        );
        setClients(updatedClients);
  
        // Reset editing state
        setIsEditing(false);
        setEditingClient(null);
      })
      .catch((error) => {
        console.error('Error updating client:', error);
      });
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingClient(null);
  };
  

  return (
    <div>
      <h2>Client Management</h2>
      <button onClick={() => setShowAddClientForm(true)}className="add-button">Add Client</button>
      {showAddClientForm && (
        <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
        <input
            type="text"
            name="shopName"
            placeholder="Shop Name"
            value={newClient.shopName}
            onChange={handleInputChange}
        />
        </div>
        <div className="form-group">
        <input
            type="text"
            name="ADRESS"
            placeholder="Address"
            value={newClient.ADRESS}
            onChange={handleInputChange}
        />
        </div>
        <div className="form-group">
        <input
            type="text"
            name="CITY"
            placeholder="City"
            value={newClient.CITY}
            onChange={handleInputChange}
        />
        </div>
        <div className="form-group">
        <input
            type="text"
            name="district"
            placeholder="District"
            value={newClient.district}
            onChange={handleInputChange}
        />
        </div>
        <div className="form-group">
        <input
            type="text"
            name="pin"
            placeholder="Pin"
            value={newClient.pin}
            onChange={handleInputChange}
        />
        </div>
        <div className="form-group">
        <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={newClient.mobile}
            onChange={handleInputChange}
        />
        </div>
        <div className="form-group">
        <input
            type="text"
            name="AGENT"
            placeholder="Agent"
            value={newClient.AGENT}
            onChange={handleInputChange}
        />
        </div>
        <div className="form-group">
        <input
            type="text"
            name="booktype"
            placeholder="Book Type"
            value={newClient.booktype}
            onChange={handleInputChange}
        />
        </div>
        <button type="submit"className="add-button">Add Client</button>
        <button onClick={() => setShowAddClientForm(false)} className="cancel-button">Cancel</button>
        </form>
      )}

      {/* Search for a client by name */}
      <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>Search</button>
    </div>
      {isEditing && (
  <div>
    <div className="edit-form">
    <h3>Edit Client</h3>
    <form onSubmit={handleUpdate}>
      {/* Render form fields for editing */}
      <div className="form-group">
        <label htmlFor="shopName">Shop Name:</label>
        <input
          type="text"
          name="shopName"
          value={editingClient.shopName}
          onChange={handleEditingInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="ADRESS">Address:</label>
        <input
          type="text"
          name="ADRESS"
          value={editingClient.ADRESS}
          onChange={handleEditingInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="CITY">City:</label>
        <input
          type="text"
          name="CITY"
          value={editingClient.CITY}
          onChange={handleEditingInputChange}
        />
      </div>
      {/* Add fields for other client attributes here */}
      <div className="form-group">
        <label htmlFor="district">District:</label>
        <input
          type="text"
          name="district"
          value={editingClient.district}
          onChange={handleEditingInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="pin">Pin:</label>
        <input
          type="text"
          name="pin"
          value={editingClient.pin}
          onChange={handleEditingInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="mobile">Mobile:</label>
        <input
          type="text"
          name="mobile"
          value={editingClient.mobile}
          onChange={handleEditingInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="AGENT">Agent:</label>
        <input
          type="text"
          name="AGENT"
          value={editingClient.AGENT}
          onChange={handleEditingInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="booktype">Book Type:</label>
        <input
          type="text"
          name="booktype"
          value={editingClient.booktype}
          onChange={handleEditingInputChange}
        />
      </div>
      <div className="button-group">
      <button type="submit" className="save-button">Save</button>
      <button onClick={cancelEdit} className="cancel-button">Cancel</button>
      </div>
    </form>
  </div>
  </div>
)}
{/* Display the list of existing clients or a message */}
{loading ? (
  <p>Loading...</p>
) : clients.length === 0 ? (
  <p>No clients found.</p>
) : (
  <table>
    <thead>
      <tr>
        <th>Shop Name</th>
        <th>Address</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {clients.map((client) => (
        <tr key={client._id}>
          <td>{client.shopName}</td>
          <td>{client.ADRESS}</td>
          <td>
          <div className="button-container">
          <button className="action-button" onClick={() => handleEdit(client)}>
                <i className="fas fa-pencil-alt"></i> 
            </button>
            <button
                className="action-button"
                onClick={() => handleDelete(client._id)}
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

export default ClientManagement;
