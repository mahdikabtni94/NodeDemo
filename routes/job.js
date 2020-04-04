const express = require('express');
const router = express.Router();
const JobController = require('../Controllers/JobController');
const checkAuth = require("../MiddleWare/check-auth");

const JobControllerinst = new JobController();
router.post("/add", function (req, res, next) {
    JobControllerinst.add(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    JobControllerinst.update(req, res, next);
});
router.get("/find", function (req, res, next) {
    JobControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    JobControllerinst.get(req, res, next);
});
module.exports = router;
