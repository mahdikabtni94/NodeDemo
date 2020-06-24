const express = require('express');
const router = express.Router();
const checkAuth = require("../MiddleWare/check-auth");
const ArticleController = require('../Controllers/ArticleController');
const ArticleControllerInst = new ArticleController();

router.get("/find", function (req, res, next) {
    ArticleControllerInst.find(req, res, next);
});

router.get('/:id', function (req, res, next) {
    ArticleControllerInst.get(req, res, next);
});

router.post("/add", function (req, res, next) {
    ArticleControllerInst.AddArticle(req, res, next);
});

router.put("/update/:id", function (req, res, next) {
    ArticleControllerInst.updateArticle(req, res, next);
});

router.delete("/delete/:id", function (req, res, next) {
    ArticleControllerInst.delete(req, res, next);
});

module.exports = router;
