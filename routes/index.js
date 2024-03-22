var express = require('express');
var router = express.Router();

const Distributors = require('../models/distributors')
const Categories = require('../models/categorys')
const Products = require('../models/products')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('productsManagement');
});
router.get('/Products', function(req, res, next) {
  res.render('productsManagement');
});
router.get('/Distributors', async function(req, res, next) {
  const distributors = await Distributors.find();
  res.render('distributorsManagement',{
    distributors: distributors
  });
});
router.get('/Categories', async function(req, res, next) {
  const categories = await Categories.find();
  res.render('categoriesManagement',{
    categories: categories
  });
});
router.get('/Products/add-product',async function(req, res, next) {
  const distributors = await Distributors.find();
  const categories = await Categories.find();
  res.render('add-product',{
    distributors: distributors,
    categories: categories,
  });
});
router.get('/Products/update-product/:id',async function(req, res, next) {
  const productId = req.params.id;
  const product = await Products.findById(productId);
  const distributors = await Distributors.find();
  const categories = await Categories.find();
  res.render('update-product',{
    product: product,
    distributors: distributors,
    categories: categories,
  });
});
router.get('/Distributors/add-distributor',async function(req, res, next) {
  res.render('add-distributor');
});
router.get('/Distributors/update-distributor/:id',async function(req, res, next) {
  const distributorID = req.params.id;
  const distributor = await Distributors.findById(distributorID);
  res.render('update-distributor',{distributor: distributor});
});

router.get('/Categories/add-category',async function(req, res, next) {
  res.render('add-category');
});
router.get('/Categories/update-category/:id',async function(req, res, next) {
  const categoryID = req.params.id;
  const category = await Categories.findById(categoryID);
  res.render('update-category',{category: category});
});

module.exports = router;
