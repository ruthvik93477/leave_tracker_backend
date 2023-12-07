const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const ejs = require('ejs');
//const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: '13', 
  resave: false,
  saveUninitialized: true,
}));

const userName = process.env.USER_NAME;
const pass = process.env.PASSWORD;
// Authentication middleware
const authenticate = (req, res, next) => {
  const { username, password } = req.session;
  const isAuthenticated = username === userName && password === pass;
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send('Unauthorized. Please log in.');
    //alert('You entered wrong password, it is notified to the developer');
    //process.exit(2);
  }
};
const conn = process.env.MONGO_URL;
mongoose.connect(conn);

const inputSchema = new mongoose.Schema({
    cn: String,
    clientName: String,
    name: String,
    cf: Number,
    ml: Number,
    jan: Number,
    feb: Number,
    mar: Number,
    apr: Number,
    may: Number,
    jun: Number,
    jul: Number,
    aug: Number,
    sep: Number,
    oct: Number,
    nov: Number,
    dec: Number,
    jan_ml: Number,
    feb_ml: Number,
    mar_ml: Number,
    apr_ml: Number,
    may_ml: Number,
    jun_ml: Number,
    jul_ml: Number,
    aug_ml: Number,
    sep_ml: Number,
    oct_ml: Number,
    nov_ml: Number,
    dec_ml: Number,
    aLeaves: Number,
    mLeaves: Number,
});

const InputData = mongoose.model('InputData', inputSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.get('http://aitek-leave-tracker1.netlify.app/landing',authenticate, (req, res) => {
  res.sendFile(__dirname + '/public/landing.html');
});

// Upload.html route
app.get('/upload',authenticate, (req, res) => {
  res.sendFile(__dirname + '/public/upload.html');
});

app.post('/upload',authenticate, async (req, res) => {
  let {cn,clientName,name,cf,ml,jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec,jan_ml,feb_ml,mar_ml,apr_ml,may_ml,jun_ml,jul_ml,aug_ml,sep_ml,oct_ml,nov_ml,dec_ml} = req.body;
  const aLeaves = parseInt(jan)+parseInt(feb)+parseInt(mar)+parseInt(apr)+parseInt(may)+parseInt(jun)+parseInt(jul)+parseInt(aug)+parseInt(sep)+parseInt(oct)+parseInt(nov)+parseInt(dec);
  const mLeaves = parseInt(jan_ml)+parseInt(feb_ml)+parseInt(mar_ml)+parseInt(apr_ml)+parseInt(may_ml)+parseInt(jun_ml)+parseInt(jul_ml)+parseInt(aug_ml)+parseInt(sep_ml)+parseInt(oct_ml)+parseInt(nov_ml)+parseInt(dec_ml);
  try {
    const inputData = new InputData({
      cn: cn,
      clientName: clientName,
      name: name,
      cf: parseInt(cf),
      ml: parseInt(ml),
      jan: parseInt(jan),
      feb: parseInt(feb),
      mar: parseInt(mar),
      apr: parseInt(apr),
      may: parseInt(may),
      jun: parseInt(jun),
      jul: parseInt(jul),
      aug: parseInt(aug),
      sep: parseInt(sep),
      oct: parseInt(oct),
      nov: parseInt(nov),
      dec: parseInt(dec),
      jan_ml: parseInt(jan_ml),
      feb_ml: parseInt(feb_ml),
      mar_ml: parseInt(mar_ml),
      apr_ml: parseInt(apr_ml),
      may_ml: parseInt(may_ml),
      jun_ml: parseInt(jun_ml),
      jul_ml: parseInt(jul_ml),
      aug_ml: parseInt(aug_ml),
      sep_ml: parseInt(sep_ml),
      oct_ml: parseInt(oct_ml),
      nov_ml: parseInt(nov_ml),
      dec_ml: parseInt(dec_ml),
      aLeaves: 12-parseInt(aLeaves)+parseInt(cf),
      mLeaves: parseInt(ml)-parseInt(mLeaves),
    });
    await inputData.save();
    let a = fs.readFileSync("public/submit.html")
    res.send(a.toString())
    //res.send("<center><h1><i>Submitted Successfully</i></h1></center>");
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Search
app.get('/search',authenticate, (req, res) => {
  res.sendFile(__dirname + '/public/search.html');
});

app.post('/search',authenticate, (req, res) => {
  const searchName = req.body.name;

  InputData.findOne({ name: searchName }).exec()
    .then(result => {
      if (result) {
        res.render('result', { result: result });
      } else {
        res.render('result', { error: "No data found for the given name." });
      }
    })
    .catch(err => {
      res.render('Please check the spelling');
    });
}); 

// Delete
app.get('/delete',authenticate, (req, res) => {
  res.sendFile(__dirname + '/public/delete.html');
});

app.post('/delete',authenticate, async (req, res) => {
  const nameToDelete = req.body.name;
  try {
    const result = await InputData.findOneAndDelete({ name: nameToDelete });
    if (result) {
      let a = fs.readFileSync("public/f.html");
      res.send(a.toString());
      //res.send("<center><h1><i>Deleted Successfully</i></h1></center>")
    } else {
      let b = fs.readFileSync("public/n.html")
      res.send(b.toString())
      //res.send("<center><h1><i>No Details found</i></h1></center>");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});
app.post('/login', (req, res) => {
  res.render('login');
});

//Contact Us
app.get('/contact',authenticate,(req,res)=>{
  res.sendFile(__dirname + '/public/contact.html');
})

app.post('http://aitek-leave-tracker1.netlify.app/landing', (req, res) => {
  const { username, password } = req.body;

  if (username === userName && password === pass) {
    req.session.username = username;
    req.session.password = password;
    res.redirect('/landing');
  } else {
    res.status(401).send('Invalid credentials. Please try again.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 
