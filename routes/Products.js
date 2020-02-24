const express = require('express');
const router = express.Router();
const checkAuth = require("../MiddleWare/check-auth");
const ProductController =require ('../Controllers/ProductController');
const ProductControllerInst = new ProductController();

router.get("",function (req, res, next) {
   ProductControllerInst.getproducts(req, res, next);
} );
router.get('/:id',function (req, res, next) {
    ProductControllerInst.getproduct(req, res, next);
} );
router.post("",checkAuth,function (req, res, next) {
    ProductControllerInst.Add(req, res, next);
} );
router.put("/:id",checkAuth,function (req, res, next) {
    ProductControllerInst.Update(req, res, next);
} );

router.delete("/:id",checkAuth,function (req, res, next) {
    ProductControllerInst.Delete(req, res, next);
});
module.exports = router;
