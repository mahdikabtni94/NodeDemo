const express = require('express');
const router = express.Router();
const ProfileController = require('../Controllers/ProfileController');
const checkAuth = require("../MiddleWare/check-auth");

const ProfileControllerinst = new ProfileController();
router.post("/add", function (req, res, next) {
    ProfileControllerinst.AddProfile(req, res, next);
});
router.get("/find", function (req, res, next) {
    ProfileControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    ProfileControllerinst.get(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    ProfileControllerinst.delete(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    ProfileControllerinst.updateProfile(req, res, next);
});
module.exports = router;
