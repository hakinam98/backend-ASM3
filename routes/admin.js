const express = require('express');

const adminController = require('../controllers/admin');
const authAdmin = require('../middleware/authadmin')
const router = express.Router();

router.post('/login', adminController.login);

router.get('/inforusers', authAdmin, adminController.getInfoUser);
router.get('/infororders', authAdmin, adminController.getInforOrder)
router.get('/inforproducts', authAdmin, adminController.getInforProduct)
router.post('/addproduct', authAdmin, adminController.addProduct)
router.post('/updateproduct', authAdmin, adminController.updateProduct)
router.delete('/inforproducts/:productId', authAdmin, adminController.deleteProduct)

module.exports = router;