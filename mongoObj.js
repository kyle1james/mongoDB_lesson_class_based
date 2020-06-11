
const { MongoClient } = require('mongodb');

class MongoDBInstance {
  constructor(){
    const mongopass = process.env.MONGOPASS;
    const username = process.env.USERNAME;
    this.uri = `mongodb+srv://${username}:${mongopass}@cluster0-jnokz.mongodb.net/<dbname>?retryWrites=true&w=majority`;
  }
  async init(){
    const client = await MongoClient.connect(this.uri, { useUnifiedTopology: true })
    const db = client.db('myApp');
    const userInfo = db.collection('locationNotes');
    this.userInfo = userInfo;
    this.db = db;
    console.log('connected to db')
  }
}
module.exports = new MongoDBInstance();