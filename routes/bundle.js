const express = require('express');
const router = express.Router();
const BundleController = require('../Controllers/BundleController');
const checkAuth = require("../MiddleWare/check-auth");

const BundleControllerinst = new BundleController();
router.post("/add", function (req, res, next) {
    BundleControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    BundleControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    BundleControllerinst.get(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    BundleControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    BundleControllerinst.update(req, res, next);
});
module.exports = router;
