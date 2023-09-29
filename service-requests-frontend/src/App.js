import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function App() {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    contactInfo: '',
    requestedService: '',
    status: 'Pending'
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://shielded-hollows-86430-85b5383bce16.herokuapp.com/requests');
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://shielded-hollows-86430-85b5383bce16.herokuapp.com/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const newRequest = await response.json();
      setRequests([...requests, newRequest]);
      setFormData({
        customerName: '',
        contactInfo: '',
        requestedService: '',
        status: 'Pending'
      });
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://shielded-hollows-86430-85b5383bce16.herokuapp.com/requests/${id}`, {
        method: 'DELETE'
      });
      setRequests(requests.filter(request => request._id !== id));
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`https://shielded-hollows-86430-85b5383bce16.herokuapp.com/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Completed' })
      });
      const updatedRequest = await response.json();
      setRequests(requests.map(request => request._id === id ? updatedRequest : request));
    } catch (err) {
      console.error("Error marking request as completed:", err);
    }
  };

  return (
    <Container>
      <h1>Service Requests</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <TextField
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          label="Customer Name"
          variant="outlined"
          style={{ marginRight: '10px' }}
          required
        />
        <TextField
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
          label="Contact Information"
          variant="outlined"
          style={{ marginRight: '10px' }}
          required
        />
        <TextField
          select
          name="requestedService"
          value={formData.requestedService}
          onChange={handleChange}
          variant="outlined"
          SelectProps={{ native: true }}
          style={{ marginRight: '10px' }}
          required
        >
          <option value="" disabled>Select Service</option>
          <option value="HVAC">HVAC</option>
          <option value="Plumbing">Plumbing</option>
        </TextField>
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Contact Information</TableCell>
              <TableCell>Requested Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map(request => (
              <TableRow key={request._id}>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>{request.contactInfo}</TableCell>
                <TableCell>{request.requestedService}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(request._id)} style={{ marginRight: '10px' }}>
                    Delete
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(request._id)}>
                    Mark as Completed
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
