const express = require('express');
const router = express.Router();
const OrderController = require('../Controllers/OrderController');
const checkAuth = require("../MiddleWare/check-auth");

const OrderControllerinst = new OrderController();
router.post("/addOrderWbundle", function (req, res, next) {
    OrderControllerinst.AddOrderWithBundles(req, res, next);
});
router.get("/find", function (req, res, next) {
    OrderControllerinst.find(req, res, next);
});
router.get("/findByOrder/:id", function (req, res, next) {
    OrderControllerinst.FindOrder(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    OrderControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    OrderControllerinst.update(req, res, next);
});
module.exports = router;
