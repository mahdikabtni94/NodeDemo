const express = require('express');
const router = express.Router();
const LineController = require('../Controllers/LineController');
const checkAuth = require("../MiddleWare/check-auth");

const LineControllerinst = new LineController();
router.post("/add", function (req, res, next) {
    LineControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    LineControllerinst.find(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    LineControllerinst.update(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    LineControllerinst.get(req, res, next);
});
router.get("/delete/:id", function (req, res, next) {
    LineControllerinst.delete(req, res, next);
});
module.exports = router;
