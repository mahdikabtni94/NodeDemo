const express = require('express');
const router = express.Router();
const CartPendingOperationController = require('../Controllers/CartPendingOperationController');
const checkAuth = require("../MiddleWare/check-auth");

const CartPendingOperationControllerinst = new CartPendingOperationController();
router.post("/add", function (req, res, next) {
    CartPendingOperationControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    CartPendingOperationControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    CartPendingOperationControllerinst.get(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    CartPendingOperationControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    CartPendingOperationControllerinst.update(req, res, next);
});
module.exports = router;
