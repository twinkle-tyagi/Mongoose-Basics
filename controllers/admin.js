
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // to create product
  const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      //userId: req.user._id, // save userId like this OR we can do like this
      userId: req.user  // in mongoose you can store whole object and mongoose will find and get only what it needs
      // here mongoose  will find _id from req.user object and assign it to userId
    })

    product.save()  // this save() is provided by mongoose
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  //req.user
  //  .getProducts({ where: { id: prodId } })
    Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch(err => console.log(err));
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  //find product to update
  Product.findById(prodId)
  .then(product => {  // here product is not JS object but mongoose object
    
    // update product with new values
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;

    // if we call save() on existing mongoose object, it will not create new, but only the changes will be saved
    return product.save();  
  })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};


exports.getProducts = (req, res, next) => {
  Product.find()  
// select is used to select only specific data we need. ID will get selected unless excluded
// can exclude some data using -, ex    -price
//  .select('title price -_id') // will only give title and price and will exclude id.


// Product.find() will find all product, but if we want to find user info associated with product, we have to manually do findById() for each user
// to do automatically we can use populate().
//populate() populates the specified field with info associated with it, we dont have to do it manually
//    .populate('userId') // will find all detail using userId and fill it in userId
    .then(products => {
      console.log(products);  // we will now get complete user info in userId field.
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
/*
  Product.findById(prodId)
  .then(product => {
    return product.remove();
  })
  */
  Product.findByIdAndRemove(prodId) // provided by mongoose
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
