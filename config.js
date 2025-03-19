let express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { dbconnect } = require('.');

const app=express()
app.use(bodyParser.json());

app.get('/', async(req, res)=>{
    res.send("<h1>This is server</h1>");
});

// Define a user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
  });
  
  // Create a User model
  const User = mongoose.model('User', userSchema);
  
  // POST endpoint for registration
  app.post('/register', async (req, res) => {
    const { new_user, new_pass, confirm_pass } = req.body;
  
    // Check if passwords match
    if (new_pass !== confirm_pass) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username: new_user });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Create a new user
      const newUser = new User({
        username: new_user,
        password: new_pass
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Send a response indicating successful registration
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.post('/login', async(req, res)=>{

});


app.listen('8100',(err)=>{
    if(err) throw err;
    dbconnect()
    console.log('server started')
})