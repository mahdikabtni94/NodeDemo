const express = require('express');
const router = express.Router();
const OperationController = require('../Controllers/OperationController');
const checkAuth = require("../MiddleWare/check-auth");

const OperationControllerinst = new OperationController();
router.post("/add", function (req, res, next) {
    OperationControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    OperationControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    OperationControllerinst.get(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    OperationControllerinst.update(req, res, next);
});

module.exports = router;
