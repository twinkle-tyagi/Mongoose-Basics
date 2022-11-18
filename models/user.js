const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        //items: [String]  //this is how you specify that items is array of string
// items is array containing productId and quantity, we then specify type of both of them
//productId is type ObjectId
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true}, // productId referes to product model
            quantity: {type: Number, required: true}
        }]
    }
});

// we can use userSchema.methods.methodName to create new methods
userSchema.methods.addToCart = function(product) {
    
    const cartProductIndex = this.cart.items.findIndex(cp => { // to find whether item with given index is in items array in cart or not.
        console.log(cp.productId, product._id);
        return cp.productId.toString() === product._id.toString();  // cp is a function to check.
    // if already in cart we just increase quantity otherwise add item to cart.
    });
        
    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];
        
    if(cartProductIndex >= 0) {   // if item is already in cart just update quantity
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {  // if not in cart, push item to updateCartItem array and then update cart, if dont do like this, it will over write previous value in cart..
    updatedCartItems.push({
        productId: product._id, //mongoose will automatically wrap product._id to ObjectId type 
        quantity: newQuantity
    });
    }
    
    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart; // store updated cart in cart
    return this.save(); // save() will update if element exists, otherwise create new 
}

/*
userSchema.methods.getCart = function() {
  
    return this.cart.items.find()
    .populate('productId')
    .then(product => {
        console.log(product);
    })
    /*
   const productIds = this.cart.items.map(i => { 
    return i.productId;
   });
   
   // we use $in operator, $in takes array of ids and every id in array will be accept and give a cursor which holds references to all products with reference to one of the ids mention in the array.
   return db.collection('products').find({_id: {$in: productIds}}) // it gives a cursor
   .toArray() // to convert cursor to array
   .then(products => {
    return products.map(p => {  // now product also need quantity, so find each product from cart fetch its quantity and add it.
      return {...p, quantity: this.cart.items.find( i => {  //... is spread operator and will give all product values to this object
        return i.productId.toString() === p._id.toString(); // will match productId we storing in cart items with _id we fetched from DB
      }).quantity // will give product object, we need quantity, so use .quantity
    }
    });
   });
   */
//}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');

// const getDB = require('../util/database').getDB;


// // as user will have one cart (One to One relationship), we do not have to worry about changing data at many places when our cart data change, we only have to change in one user.
// // we can store cart inside user document.

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDB();

//     return db.collection('users').insertOne(this)
//     .then(user => {
//       console.log("successfully created user", user);
//     })
//     .catch(err => console.log(err));
//   }


//   addToCart(product) {
    
//     const cartProductIndex = this.cart.items.findIndex(cp => { // to find whether item with given index is in items array in cart or not.
//       console.log(cp.productId, product._id);
//       return cp.productId.toString() === product._id.toString();  // cp is a function to check.
//   // if already in cart we just increase quantity otherwise add item to cart.
//   });

//   let newQuantity = 1;
//   let updatedCartItems = [...this.cart.items];

//   if(cartProductIndex >= 0) {   // if item is already in cart just update quantity
//     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//   }
//   else {  // if not in cart, push item to updateCartItem array and then update cart, if dont do like this, it will over write previous value in cart..
//     updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: newQuantity});
//   }
//     //product.quantity = 1;
//     //const updatedCart = { items: [product] } // we can do like this
//     //const updatedCart = { items: [{ ...product, quantity: 1}] } // or do like this.
//     //here whole product will be in cart as a copy and if something changes in product it will not reflected here
//     // so we will not save whole product but just productID with quantity
    
//     const updatedCart = {
//       items: updatedCartItems
//       //items: [{productId: new mongodb.ObjectId(product._id), quantity: 1}]
//     };

//     const db = getDB();
//     return db.collection('users')
//     .updateOne({_id: new mongodb.ObjectId(this._id)}, 
//     {$set: {cart: updatedCart}})  // putting value of updatedCart in cart.
//   }


//   getCart() {
//     // return this.cart; //will give access to the cart that user has. //cart is in constructor of User
//    // but we want to get complete populated cart.
//    const db = getDB();
//    // items contains both productId and quantity, but we only need quantity, so we can use map() on items(which is an array).
//    const productIds = this.cart.items.map(i => { 
//     return i.productId;
//    });
//    // we need to get products, we get it from products collection.
//    // we use $in operator, $in takes array of ids and every id in array will be accept and give a cursor which holds references to all products with reference to one of the ids mention in the array.
//    return db.collection('products').find({_id: {$in: productIds}}) // it gives a cursor
//    .toArray() // to convert cursor to array
//    .then(products => {
//     return products.map(p => {  // now product also need quantity, so find each product from cart fetch its quantity and add it.
//       return {...p, quantity: this.cart.items.find( i => {  //... is spread operator and will give all product values to this object
//         return i.productId.toString() === p._id.toString(); // will match productId we storing in cart items with _id we fetched from DB
//       }).quantity // will give product object, we need quantity, so use .quantity
//     }
//     });
//    });
//   }


//   deleteFromCart(productId) {
//     const updateCartItem = this.cart.items.filter(item => { //filter out element that match productId
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDB();
//     return db.collection('users')
//     .updateOne(
//       {_id: new mongodb.ObjectId(this._id)},
//       { $set: {cart: {items: updateCartItem}}} );
//   }

//   addOrder() {
//     const db = getDB();
//     return this.getCart()    // step1 - we get array of products using getCarts
//     .then(products => {
//       const order = {   // step2 - we create order using product
//         items: products,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           name: this.name
//         }
//       };
//       //step3 - insert this data into orders collection
//       return db.collection('orders').insertOne(order) //we just want to enter everything in cart to order, we can do so using this.cart
//     })
//     //step4 - clean up existing cart.
//     .then(result => {
//       this.cart ={items: []}; //empty the cart, but we have to empty it in database also.
      
//       //update cart to empty.
//       return db.collection('users')
//       .updateOne(
//         {_id: new mongodb.ObjectId(this._id)},
//         {$set: {cart: {items: []}}}
//       )
//     })
//   }


//   getOrders() {
//     const db = getDB();
//     return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}) // to check nested properties by defining path to them, to define path we add them in quotation mark
// //._id will look for _id in user which is embedded(nested) into orders. we then compare it with _id from DB
//     .toArray()  //as there may be many orders for same user so we will convert it into array
//   }


//   static findById(id) {
//     const db = getDB();

//     return db.collection('users').findOne({_id: new mongodb.ObjectId(id)})
//     .then(user => {
//       console.log(user);
//       return user;
//     })
//     .catch(err => console.log(err));
//   }
// }

// module.exports = User;