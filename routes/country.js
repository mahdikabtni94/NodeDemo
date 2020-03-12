const express = require('express');
const router = express.Router();
const CountryController = require('../Controllers/CountryController');
const checkAuth = require("../MiddleWare/check-auth");

const CountryControllerinst = new CountryController();
router.post("/add", function (req, res, next) {
    CountryControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    CountryControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    CountryControllerinst.get(req, res, next);
});
module.exports = router;
