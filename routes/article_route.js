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

router.get("/findOperationsById/:id", function (req, res, next) {
    ArticleControllerInst.FindOperationsByArticle(req, res, next);
});
/*router.get("/findLinesAndOperationsById/:id", function (req, res, next) {
    ArticleControllerInst.FindLinesAndOperationsByArticle(req, res, next);
});*/
router.get("/findLinesById/:id", function (req, res, next) {
    ArticleControllerInst.FindLinesBYArticle(req, res, next);
});
router.get("/findOperationsByLine/:id", function (req, res, next) {
    ArticleControllerInst.FindOperationsByLine(req, res, next);
});
module.exports = router;
