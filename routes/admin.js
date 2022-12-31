const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/login', adminController.login);

router.get('/inforusers', isAuth.AuthAdminLogin, adminController.getInfoUser);
router.get('/infororders', isAuth.AuthAdminLogin, adminController.getInforOrder)
router.get('/inforproducts', isAuth.AuthAdminLogin, adminController.getInforProduct)
router.post('/addproduct', isAuth.AuthAdminLogin, adminController.addProduct)
router.post('/updateproduct', isAuth.AuthAdminLogin, adminController.updateProduct)
router.delete('/inforproducts/:productId', isAuth.AuthAdminLogin, adminController.deleteProduct)

module.exports = router;