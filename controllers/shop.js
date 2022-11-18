const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()    // doesnot give cursor but gives products.
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // prodId is string, but _id is ObjectId type, mongoose converts prodId to ObjectId type automatically
  Product.findById(prodId)  //findById() is method provided by mongoose
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user    // will get cart, we need to populate on productID
    .populate('cart.items.productId')
    //.execPopulate()   //populate do not return promise, so we cannot call then on it, to do so we can use execPopulate()
    .then(user => {
      const products = user.cart.items;
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)  //find product
  .then(product => {
    return req.user.addToCart(product)  // add this product to cart.
  })
  .then(result => {
    console.log(result);
    res.redirect('/cart');
  })

 /*
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findById(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
     */
    .catch(err => console.log(err));
   
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  //.execPopulate()
  .then(user => {
    // const products = user.cart.items; // here we have array elements where we have quantity and real product data is nested in productId field, so we need to extract that data
// we need to map this products data according to Order model, for that we can use map()

    console.log(user.cart.items);
    const products = user.cart.items.map(i => {
      //return {quantity: i.quantity, product: i.productId}   // we make object according to our Order model and then return it
      // right now we will not get full product in product field above but just productId 
      //to get full product we make new JS object by wrapping i.productId in {}, using spread operator to get all data of it
      // and use special method _doc that mongoose provides us.
      // productId is an object with lot of meta data attached to it, so we can use _doc on it
      // with _doc we just get just data from productId and using spread operator we pull out all the data from document we used _doc on(productId)
      return {quantity: i.quantity, product: {...i.productId._doc}};
    })
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user  // mongoose will extract userId automatically
      },
      products: products
    });
    return order.save();
  })
    .then(result => {
      return req.user.clearCart();  //clear cart
    })
    .then(() => {
      res.redirect('/orders');    //then re-route
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};