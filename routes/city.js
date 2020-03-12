const express = require('express');
const router = express.Router();
const cityController = require('../Controllers/cityController');
const checkAuth = require("../MiddleWare/check-auth");

const cityControllerinst = new cityController();
router.post("/add", function (req, res, next) {
    cityControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    cityControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    cityControllerinst.get(req, res, next);
});
module.exports = router;
