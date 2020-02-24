const express = require('express');
const router = express.Router();
const checkAuth = require("../MiddleWare/check-auth");
const CategoryController = require('../Controllers/CategoryController');
const CategoryControllerInst = new CategoryController();

router.get("", function (req, res, next) {
    CategoryControllerInst.find(req, res, next);
});

router.get('/:id', function (req, res, next) {
    CategoryControllerInst.get(req, res, next);
});

router.post("", function (req, res, next) {
    CategoryControllerInst.add(req, res, next);
});

router.put("/:id", checkAuth, function (req, res, next) {
    CategoryControllerInst.update(req, res, next);
});

router.delete("/:id", checkAuth, function (req, res, next) {
    CategoryControllerInst.delete(req, res, next);
});

module.exports = router;
