const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth')
const router = express.Router();

router.post('/login', adminController.login);

router.get('/inforusers', isAuth, adminController.getInfoUser);
router.get('/infororders', isAuth, adminController.getInforOrder)
router.get('/inforproducts', isAuth, adminController.getInforProduct)
router.post('/addproduct', isAuth, adminController.addProduct)
router.post('/updateproduct', isAuth, adminController.updateProduct)
router.delete('/inforproducts/:productId', isAuth, adminController.deleteProduct)

module.exports = router;