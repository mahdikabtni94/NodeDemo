const express = require('express');
const router = express.Router();
const CartPendingSessionController = require('../Controllers/CartPendingSessionController');
const checkAuth = require("../MiddleWare/check-auth");

const CartPendingSessionControllerinst = new CartPendingSessionController();
router.post("/add", function (req, res, next) {
    CartPendingSessionControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    CartPendingSessionControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    CartPendingSessionControllerinst.get(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    CartPendingSessionControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    CartPendingSessionControllerinst.update(req, res, next);
});
module.exports = router;
