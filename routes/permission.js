const express = require('express');
const router = express.Router();
const PermissionController = require('../Controllers/PermissionController');
const checkAuth = require("../MiddleWare/check-auth");

const PermissionControllerinst = new PermissionController();
router.post("/add", function (req, res, next) {
    PermissionControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    PermissionControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    PermissionControllerinst.get(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    PermissionControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    PermissionControllerinst.update(req, res, next);
});
module.exports = router;
