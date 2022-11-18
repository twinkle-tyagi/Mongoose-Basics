const mongoose = require('mongoose');

// MongoDB dont have schema why crreate here?
//we often have a structure in data we work with, and mongoose wants to give u advantage of this, just focusing on our data, but for that it needs to know how our data looks like.
// we can still deviate from this by instantiating a new product having completely differet fields.

const Schema = mongoose.Schema; //Schema is a constructor that allows us to create schemas

// creating schema for product by instantiating Schema
const productSchema = new Schema({  // in constructor we will pass a JS object which tells us how our product should look like.
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: { //each product should be assigned to a user, so must conatin user reference(userId)
    type: Schema.Types.ObjectId,  //type is ObjectId
// userId type is ObjectId which can be any models Id, but using ref we specify this userId belongs to which model.
//ref is special config, that takes string, that tells mongoose which other mongoose model this data is related to.
//ref takes name of model as parameter.
    ref: 'User', // now userId refers to User model.
    required: true
  }
}); 

//model is a fuction we call to connect schema to a name
module.exports = mongoose.model('Product', productSchema) //model(modelName, schema) 






// //const mongoConnect = require('../util/database'); // to get connect function.
// // but this way we have to connect to mongodb for every operation we do and we might not even disconnect.
// // better way is to maintain one connection to the database and return connection to the client which we setup.

//  const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB; // to get access to database.

// // we create a class to descibe our product
// class Product {
//   constructor(title, price, description, imageUrl, id, userId) { // constructor created to make object of product that contains values of product
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     //this._id = new mongodb.ObjectId(id); // we need to do this so that this will always have id of ObjectId type
//   // we cannot add product because control was always going in if block of save,
//   // because even if id is undefined new mongodb.ObjectId(id) will generate an id and assign it to it.
//   // so we can do a check, if id is there(old product) we encapsulate it, if not there(new product) we pass null
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId; // to connect product to user.
//   }

//   // we will change save so that if product is already (_id is present) there save will update it, 
//   // if product is new (_id is undefined), we insert it.
  
//   save() {  // this is the method we will create to store data using mongodb.
//     const db = getDB();
//     let dbOp;
    
//     if(this._id) { // product already present, update it
//       //updateOne() takes two arguments, first - filter (JS object {_id: prodID}) which define which document to update
//       // second - how to update that document. which is JS object which defines the updates.
//       // it is not new document so we cant use this, but we use $set , which is special property name, resrved keyword understood by mongodb
//       //$set again takes an object as value, where we describe what changes we need to make.
//       //$set: {title: this.title, price: this.price, ...} but we want to update all so we can write this.
//       dbOp = db.collection('products')
//       //.updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this}) //$set: this will give error because this is string and we will get _id as string but it should be ObjectId type. so we wrap id in product constructor
//       .updateOne({ _id: this._id }, {$set: this})
//     }
//     else {
//       dbOp = db.collection('products').insertOne(this);
//     }
    
    
//     //db.collection('products'); // to create collections in database, if not there it will be created when we first enter data.
//     //here you can call insertOne() - to insert one data, or, insertMany([array of JS objects]) - to insert multiple data, 
//     return dbOp
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }

//   /*
//   static fetchAll() {
//     // return db.collection('products).find({title: 'book1'}) // to search specific item.
//     return db.collection('products').find();  // find is function provided by mongodb
//     //find does not immediately return a promise, but provides a cursor, cursor is an object provided by mongodb, using which we can go through all the element we found one by one
//     //find can return million of elements, so its better to go through them one by one.
//     // we can use toArray() to get all the methods and turn them into an array. only use if less elements

//   }
//   */


//   static fetchAll() {
//     const db = getDB(); // to get access to database.
//     return db.collection('products')
//     .find()
//     .toArray()
//     .then()
//     .catch(err => console.log(err));
//   }

//   static findById(prodId) {
//     const db = getDB();
//     //return db.collection('products').find({_id: prodId}) //mongodb will still give us a cursor, so we will use next() to get next element which will be the element we want, and on that we can apply then and catch 
//     // above code will give error as_id is ObjectId type and prodId is string type
//     return db.collection('products').find({_id: new mongodb.ObjectId(prodId)}) // we encapsulate prodId with ObjectId type to make them equal.
//     .next()
//     .then(product => {
//       console.log(product)
//       return product;
//     })
//     .catch(err => console.log(err));
//   }

//   static deleteById(prodId) {
//     const db = getDB();
//     return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
//     .then(prod => {
//       console.log("deleted successfully");
//     })
//     .catch(err => console.log(err));
//   }
// }

// module.exports = Product;
