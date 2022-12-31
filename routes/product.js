const express = require('express');

const productController = require('../controllers/product')

const router = express.Router();

router.get('/', productController.Products);
router.get('/:productId', productController.ProductById);

router.post('/category', productController.ProductByCategory);

router.post('/pagination', productController.ProductPagination);


module.exports = router;