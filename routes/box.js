const express = require('express');
const router = express.Router();
const BoxController = require('../Controllers/BoxController');
const checkAuth = require("../MiddleWare/check-auth");

const BoxControllerinst = new BoxController();
router.post("/add", function (req, res, next) {
    BoxControllerinst.add(req, res, next);
});
router.post("/loginBox/:rfid/:source_addr/:box_ip/:box_version", function (req, res, next) {
    BoxControllerinst.authAction(req, res, next);
});
router.get("/find", function (req, res, next) {
    BoxControllerinst.find(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    BoxControllerinst.update(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    BoxControllerinst.get(req, res, next);
});
module.exports = router;
