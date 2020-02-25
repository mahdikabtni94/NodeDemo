const express = require('express');
const router = express.Router();
const UserController = require("../Controllers/UserController");

const userControllerInst = new UserController();

const checkAuth = require("../MiddleWare/check-auth");
router.post("/signup", function (req, res, next) {
    userControllerInst.adduser(req, res, next);
});

router.post("/login", function (req, res, next) {
    userControllerInst.loginUser(req, res, next);
});
router.delete("/deleteUser/:id", function (req, res, next) {
    userControllerInst.delete(req, res, next);
});
router.get("/findUser", function (req, res, next) {
    userControllerInst.find(req, res, next);
});
router.get("/findUser/:id", function (req, res, next) {
    userControllerInst.get(req, res, next);
});
router.put("/updateUser/:id", function (req, res, next) {
    userControllerInst.update(req, res, next);
});
router.get("/confirmation/:token", function (req, res, next) {
    userControllerInst.confirmUserAccount(req, res, next);
});


module.exports = router;
