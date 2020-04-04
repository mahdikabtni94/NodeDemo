const express = require('express');
const router = express.Router();
const EmployeeController = require('../Controllers/EmployeeController');
const checkAuth = require("../MiddleWare/check-auth");

const EmployeeControllerinst = new EmployeeController();
router.post("/add", function (req, res, next) {
    EmployeeControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    EmployeeControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    EmployeeControllerinst.get(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    EmployeeControllerinst.update(req, res, next);
});

module.exports = router;
