const express = require('express');
const router = express.Router();
const CustomerController = require('../Controllers/CustomerController');
const checkAuth = require("../MiddleWare/check-auth");

const CustomerControllerinst = new CustomerController();
router.post("/add", function (req, res, next) {
   CustomerControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    CustomerControllerinst.find(req, res, next);
});
module.exports = router;
