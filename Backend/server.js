const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/donationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB schema and model
const donationSchema = new mongoose.Schema({
  program: String,
  amount: Number,
  check: String,
  bank_name: String,
  place: String,
  name: String,
  email: String,
  phone: String,
  address: String,
});

const Donation = mongoose.model('Donation', donationSchema);

// Endpoint to handle donation form submission
app.post('/submit_donation', (req, res) => {
  const newDonation = new Donation(req.body);
  newDonation.save()
    .then(() => res.send('Donation submitted successfully'))
    .catch(err => res.status(400).send('Error: ' + err));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
