import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransporterManagement() {
  // State variables
  const baseURL = 'https://invoice-api-2ldk.onrender.com';
  const [transporters, setTransporters] = useState([]);
  const [newTransporter, setNewTransporter] = useState({
    name: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddTransporterForm, setShowAddTransporterForm] = useState(false);
  const [editingTransporter, setEditingTransporter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch initial transporter data from the server when the component mounts
  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = `${baseURL}/transporters`;

    // Make a GET request to fetch transporters
    axios
      .get(apiUrl)
      .then((response) => {
        setTransporters(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching transporters:', error);
        setLoading(false); // Set loading to false if an error occurs
      });
  }, []);

  // Handle input changes in the "Add Transporter" form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTransporter({ ...newTransporter, [name]: value });
  };

  // Handle submission of the "Add Transporter" form
  const handleSubmit = (event) => {
    event.preventDefault();

    // Define the API endpoint URL
    const apiUrl = `${baseURL}/transporters`;

    // Make a POST request to create a new transporter
    axios
      .post(apiUrl, newTransporter)
      .then((response) => {
        setTransporters([...transporters, response.data]);
        // Clear the form fields
        setNewTransporter({
          name: '',
        });
      })
      .catch((error) => {
        console.error('Error creating transporter:', error);
      });
  };

  // Handle transporter deletion
  const handleDelete = (transporterId) => {
    // Define the API endpoint URL
    const apiUrl = `${baseURL}/transporters/${transporterId}`;

    // Make a DELETE request to delete the transporter from the server
    axios
      .delete(apiUrl)
      .then(() => {
        // Remove the transporter from the transporters array
        setTransporters(transporters.filter((transporter) => transporter._id !== transporterId));
      })
      .catch((error) => {
        console.error('Error deleting transporter:', error);
      });
  };

  const handleSearch = () => {
    // Implement transporter search logic here

    // Create a copy of the original transporters array to avoid modifying the original data
    const filteredTransporters = [...transporters];

    // Filter the transporters based on the search term
    const searchResults = filteredTransporters.filter((transporter) =>
      transporter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update the state with the search results
    setTransporters(searchResults);
  };

  const handleEdit = (transporter) => {
    setEditingTransporter(transporter);
    setIsEditing(true);
  };

  const handleEditingInputChange = (event) => {
    const { name, value } = event.target;
    setEditingTransporter({
      ...editingTransporter,
      [name]: value,
    });
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    // Define the API endpoint URL for updating a transporter
    const apiUrl = `${baseURL}/transporters/${editingTransporter._id}`;

    // Make a PUT request to update the transporter
    axios
      .put(apiUrl, editingTransporter)
      .then((response) => {
        // Update the transporter list with the edited data
        const updatedTransporters = transporters.map((transporter) =>
          transporter._id === editingTransporter._id ? response.data : transporter
        );
        setTransporters(updatedTransporters);

        // Reset editing state
        setIsEditing(false);
        setEditingTransporter(null);
      })
      .catch((error) => {
        console.error('Error updating transporter:', error);
      });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingTransporter(null);
  };

  return (
    <div>
      <h2>Transporter Management</h2>
      <button onClick={() => setShowAddTransporterForm(true)} className="add-button">
        Add New Transporter
      </button>
      {showAddTransporterForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Transporter Name"
              value={newTransporter.name}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="add-button">
            Add Transporter
          </button>
          <button
            onClick={() => setShowAddTransporterForm(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Search for a transporter by name */}
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
            <h3>Edit Transporter</h3>
            <form onSubmit={handleUpdate}>
              {/* Render form fields for editing */}
              <div className="form-group">
                <label htmlFor="name">Transporter Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editingTransporter.name}
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

      {/* Display the list of existing transporters or a message */}
      {loading ? (
        <p>Loading...</p>
      ) : transporters.length === 0 ? (
        <p>No transporters found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Transporter Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transporters.map((transporter) => (
              <tr key={transporter._id}>
                <td>{transporter.name}</td>
                <td>
                  <div className="button-container">
                  <button
                      className="action-button"
                      onClick={() => handleEdit(transporter)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleDelete(transporter._id)}
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

export default TransporterManagement;
