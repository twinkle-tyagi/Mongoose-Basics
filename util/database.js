const  mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; //constructor 

//to connect to mongodb client.
//url from mongodb site we get.

let _db; // so that we dont call mongoConnect for each operation

const mongoConnect = callback => {
  MongoClient.connect(`mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@cluster0.1ub4dke.mongodb.net/?retryWrites=true&w=majority`)
  .then(client => {
    console.log('connected');
    _db = client.db(); // store connection to database
    //callback(client);
    callback(); // wont pass anything inside it now
  })
  .catch(err => {
    console.log(err);
    throw err;
  });  
};

const getDB = () => {
  if(_db) {
    return _db;
  }
  throw "No DB found";
}

//module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDB = getDB;