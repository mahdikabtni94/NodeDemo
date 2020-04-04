const express = require('express');
const router = express.Router();
const Machine_TypeController = require('../Controllers/Machine_TypesController');
const checkAuth = require("../MiddleWare/check-auth");

const Machine_TypeControllerinst = new Machine_TypeController();
router.post("/add", function (req, res, next) {
    Machine_TypeControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    Machine_TypeControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    Machine_TypeControllerinst.get(req, res, next);
});
module.exports = router;
