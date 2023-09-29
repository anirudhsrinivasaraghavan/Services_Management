const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');  // For allowing cross-origin requests

const app = express();
var PORT = process.env.PORT || 80

mongoose.connect('mongodb+srv://as4098:incorrect@cluster0.ookcybg.mongodb.net/?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const ServiceRequestSchema = new mongoose.Schema({
  customerName: String,
  contactInfo: String,
  requestedService: String,
  status: { type: String, default: 'Pending' }
});

const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);

app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());

app.get('/requests', async (req, res) => {
  try {
    const requests = await ServiceRequest.find();
    res.json(requests);
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/requests', async (req, res) => {
  try {
    const request = new ServiceRequest(req.body);
    await request.save();
    res.json(request);
  } catch(err) {
    res.status(400).json({ message: 'Bad request' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Service Requests API!');
});

app.put('/requests/:id', async (req, res, next) => {
    try {
      const updatedRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedRequest) throw new Error('Service request not found');
      res.json(updatedRequest);
    } catch(err) {
      next(err);
    }
  });

  app.delete('/requests/:id', async (req, res, next) => {
    try {
      const deletedRequest = await ServiceRequest.findByIdAndDelete(req.params.id);
      if (!deletedRequest) throw new Error('Service request not found');
      res.json({ message: 'Deleted successfully' });
    } catch(err) {
      next(err);
    }
  });
  
  

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
