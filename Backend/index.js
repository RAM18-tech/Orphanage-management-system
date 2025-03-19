var express =require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
var cors=require('cors')

const app=express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('FRONTEND'));
app.use(bodyParser.urlencoded({
    extended:true
}))


mongoose.connect('mongodb://localhost:27017/DataBase')
var db=mongoose.connection
db.on('error',()=>console.log("Error in connecting to DataBase"))
db.once('open',()=>console.log("Connected to DataBase"))



app.post("/register",(req,res) =>{
    var new_user = req.body.username;
    var new_pass = req.body.password;

    // Check if the username already exists in the database
    db.collection('users').findOne({ username:new_user,password:new_pass}, (err, user) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "An error occurred while processing your request. Please try again later." });
        }
        if (user) {
            // Username already exists, send error response
            return res.status(400).json({ error: "Username already exists. Please choose a different username." });
        }

        // If the username is unique, proceed with registration
        var data = {
            username: new_user,
            password: new_pass
        };
        db.collection('users').insertOne(data, (err, collection) => {
            if (err) {
                console.error("Error:", err);
                return res.status(500).json({ error: "An error occurred while processing your request. Please try again later." });
            }
            console.log("Record Inserted Successfully");
            return res.json({ Status: "successful" });
        });
    });
});


app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    // Assuming you have a User model defined with Mongoose
    // Replace 'User' with your actual Mongoose model name
    db.collection('users').findOne({ username: username, password: password }, (err, user) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "An error occurred while processing your request. Please try again later." });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password." });
        }
            // If login is successful, you may choose to send : user });
        return res.json({ Status: "Login successful", user: user });
    });
});




// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DataBase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB");
});

// Define donation schema
const donationSchema = new mongoose.Schema({
    program: String,
    amount: Number,
    check: String,
    bank_name: String,
    place: String,
    name: String,
    email: String,
    phone: String,
    address: String
});

// Create a model based on the schema
const Donation = mongoose.model('Donation', donationSchema);

// Route to handle donation submission
app.post("/submit_donation", (req, res) => {
    const newDonation = new Donation(req.body);
    newDonation.save()
        .then(() => {
            console.log("Donation saved successfully");
            res.status(201).json({ message: "Donation submitted successfully" });

        })
        .catch((err) => {
            console.error("Error saving donation:", err);
            res.status(500).json({ error: "An error occurred while processing your request" });
        });
});


mongoose.connect('mongodb://localhost:27017/DataBase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB");
});

// Define feedback schema
const feedbackSchema = new mongoose.Schema({
    full_name: String,
    full_address: String,
    phone: String,
    email: String,
    comment: String
});

// Create a model based on the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Route to handle feedback submission
app.post("/submit_feedback", (req, res) => {
    // Extract data from the request body
    const { full_address, full_name, phone, email, comment } = req.body;

    // Create a new Feedback object
    const newFeedback = new Feedback({
        full_name: full_name,
        full_address: full_address,
        phone: phone,
        email: email,
        comment: comment
    });

    // Save the new feedback to the database
    newFeedback.save()
        .then(() => {
            console.log("Feedback saved successfully");
            res.status(201).json({ message: "Feedback submitted successfully" });
        })
        .catch((err) => {
            console.error("Error saving feedback:", err);
            res.status(500).json({ error: "An error occurred while processing your request" });
        });
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DataBase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema for children's data
const childSchema = new mongoose.Schema({
  name: String,
  age: Number,
  sponsored: Boolean
});

const Child = mongoose.model('Child', childSchema);

// Route to handle the request for sponsored children
app.get('/sponsored-children', async (req, res) => {
  try {
    // Query MongoDB for sponsored children
    const sponsoredChildren = await Child.find({ sponsored: true });
    res.json(sponsoredChildren);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DataBase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema for children's data (you can change the schema name)
const childschema = new mongoose.Schema({
  name: String,
  age: Number,
  sponsored: Boolean
});

// Define a different model name for the schema (you can change the model name)
const ChildModel = mongoose.model('DifferentChild', childSchema);

// Route to handle the request for non-sponsored children with a different endpoint
app.get('/notsponsored', async (req, res) => {
  try {
    // Query MongoDB for non-sponsored children using the defined schema and model name
    const nonSponsoredChildren = await ChildModel.find({ sponsored: false });
    res.json(nonSponsoredChildren);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




 app.get("/",(req,res) => {
    res.send("<h1>This is server</h1>")
 }).listen(8100);

 console.log("Listening on port 8100")