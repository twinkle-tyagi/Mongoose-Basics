const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  
  User.findById('63751ae91691a266318da357')
    .then(user => {
      //req.user = user; // send user in request. // we cannot access functions of user here
      req.user = new User(user.name, user.email, user.cart, user._id); // we can make user like this
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

/*
mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
})
*/

//after 
mongoConnect(() => {  // we won't get client now
  app.listen(3000);
})
