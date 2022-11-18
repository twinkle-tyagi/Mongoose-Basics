const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  
  User.findById('637792864785d80b2c8409e8')
    .then(user => {
      req.user = user; // send user in request. 
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@cluster0.1ub4dke.mongodb.net/?retryWrites=true&w=majority`)
.then(result => {
  User.findOne()    //findOne without any argument will return first element 
  .then(user => {
//if user is not there we create it, otherwise we don't.
    if(!user) {
      const user = new User({ // to create a new user
        // user will contain name, email and cart and cart will have empty array of items.
          name: 'Max',
          email: "max@gmail.com",
          cart: {
            items: []
          }
        });
        user.save(); //to add user to database
    }
  }) 
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});