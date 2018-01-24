const Model = require('../models');

const { Product, Manufacturer } = Model;

const productController = {
  all(req, res) {
    // Returns all products
    Product.find({})
    // alongside it's manufacturer information
    .populate('Manufacturer')
    .exec((err, products) => res.json(products));
  },

  byId(req, res) {
    const idParam = req.params.id;
    // Returns a single product

    Product
    .findOne({ _id: idParam })
    // as well as it's manufacturer
    .populate('manufacturer')
    .exec((err, product) => res.json(product));
  },

  create(req, res) {
    const requestBody = req.body;
  // Creates a  new record froma submitted form
    const newProduct = new Product(requestBody);
  // Saves the data to db
    newProduct.save((err, saved) => {
  // returns the saved product after successful save
      Product
    .findOne({ _id: saved.id })
    .populate('Manufacturer')
    .exec((err, product) => res.json(product));
    });
  },
  update(req, res) {
    const idParam = req.params.id;
    let product = req.body;
    // finds a product to be updated
    Product.findOne({ _id: idParam }, (err, data) => {
    // Updates the product payload
	  data.name = product.name;
      data.description = product.description;
      data.image = product.image;
      data.price = product.price;
      data.manufacturer = product.manufacturer;
    // saves the product
      data.save((err, updated) => res.json(updated));
      data.image = product.image;
      data.price = product.price;
      data.manufacturer = product.manufacturer;
    // saves the product
      data.save((err, updated) => res.json(updated));
    });
  },
  remove(req, res) {
    const idParam = req.params.id;
  // Removes a product
    Product.findOne({ _id: idParam }).remove((err, removed) => res.json(idParam));
  },
};

module.exports = productController;
