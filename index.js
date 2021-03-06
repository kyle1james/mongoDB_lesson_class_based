const express = require('express');
const app = express();
const port = 4000;
// static files use public
app.use(express.static('public'));
// dotenv
require('dotenv').config();
// for reading objectID's saved as a string
const { ObjectId } = require('mongodb');
// bring in db and initialize
const database = require('./mongoObj');
database.init();
// read forms sent
const bodyParser = require('body-parser');
app.use(bodyParser.json());



// root
app.get('/', async (req, res) => {
    res.sendFile(path.join(`${__dirname}/index.html`));
  });

// showing data
// GET/ READ
app.get('/show', async (req, res) =>{
  const data = await database.userInfo.find().toArray();
  res.json(data);
});

// adding data
app.post('/addUserInfo', (req, res) =>{
  // unpack the body of the req
  const {lat, lon, note} = req.body;
  console.log(lat);
  // send data to the collection locationNotes
  database.userInfo.insertOne({lat, lon, note});
  console.log('pat on the back')
})

// updating data

app.post('/update', (req, res) => {
    const data = req.body;
    console.log(data);
    database.userInfo.findOneAndUpdate(
      { _id: ObjectId(data.id) },
      {
        $set: {
          note: data.note,
        },
      },
    );
    res.redirect('/');
});

// listen on port 4000
app.listen(process.env.PORT || 4000)
