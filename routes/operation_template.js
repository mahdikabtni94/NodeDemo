const express = require('express');
const router = express.Router();
const OperationTempalteController = require('../Controllers/OperationTemplateController');
const checkAuth = require("../MiddleWare/check-auth");

const OperationTempalteControllerinst = new OperationTempalteController();
router.post("/add", function (req, res, next) {
    OperationTempalteControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    OperationTempalteControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    OperationTempalteControllerinst.get(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    OperationTempalteControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    OperationTempalteControllerinst.update(req, res, next);
});
module.exports = router;
