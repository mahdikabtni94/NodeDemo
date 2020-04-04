const express = require('express');
const router = express.Router();
const UserSessionController = require('../Controllers/UserSessionController');
const checkAuth = require("../MiddleWare/check-auth");

const UserSessionControllerinst = new UserSessionController();
router.post("/add", function (req, res, next) {
    UserSessionControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    UserSessionControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    UserSessionControllerinst.get(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    UserSessionControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    UserSessionControllerinst.update(req, res, next);
});
module.exports = router;
