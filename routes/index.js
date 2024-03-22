var express = require('express');
var router = express.Router();

const Distributors = require('../models/distributors')
const Categorys = require('../models/categorys')
const Products = require('../models/products')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('productsManagement');
});
router.get('/Products', function(req, res, next) {
  res.render('productsManagement');
});
router.get('/Distributors', function(req, res, next) {
  res.render('distributorsManagement');
});
// router.get('/Fruits/add-fruit',async function(req, res, next) {
//   const distributors = await Distributors.find();
//   res.render('add-fruit',{
//     distributors: distributors,
//   });
// });
// router.get('/update-fruit/:id',async function(req, res, next) {
//   const fruitId = req.params.id;
//   const fruit = await Fruits.findById(fruitId);
//   const distributors = await Distributors.find();
//   res.render('update-fruit',{
//     fruit: fruit,
//     distributors: distributors,
//   });
// });
// router.get('/Distributor/add-distributor',async function(req, res, next) {
//   res.render('add-distributor');
// });
// router.get('/Distributor/update-distributor/:id',async function(req, res, next) {
//   const distributorID = req.params.id;
//   const distributor = await Distributors.findById(distributorID);
//   res.render('update-distributor',{distributor: distributor});
// });

module.exports = router;
