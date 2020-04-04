const express = require('express');
const router = express.Router();
const SiteController = require('../Controllers/SiteController');
const checkAuth = require("../MiddleWare/check-auth");

const SiteControllerinst = new SiteController();
router.post("/add", function (req, res, next) {
    SiteControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    SiteControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    SiteControllerinst.get(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    SiteControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    SiteControllerinst.update(req, res, next);
});
module.exports = router;
