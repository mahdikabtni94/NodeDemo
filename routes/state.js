const express = require('express');
const router = express.Router();
const stateController = require('../Controllers/stateController');
const checkAuth = require("../MiddleWare/check-auth");

const stateControllerinst = new stateController();
router.post("/add", function (req, res, next) {
    stateControllerinst.add(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    stateControllerinst.update(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    stateControllerinst.delete(req, res, next);
});
router.get("/find", function (req, res, next) {
    stateControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    stateControllerinst.get(req, res, next);
});
module.exports = router;
