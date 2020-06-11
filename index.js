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
database.init()
// read forms sent
const bodyParser = require('body-parser');
app.use(bodyParser.json());



// root
app.get('/', async (req, res) => {
    res.sendFile(path.join(`${__dirname}/index.html`));
  });

// showing data
app.get('/show', async (req, res) =>{
    const data = await database.userInfo.find().toArray();
    res.json(data);
});

// adding data
app.get('/location/:lat/:lon/:note', (req, res) => {
    const {lat, lon, note} = req.params;
    database.userInfo.insertOne({lat, lon, note});
    console.log('add info')
    res.redirect('/');
});

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
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))