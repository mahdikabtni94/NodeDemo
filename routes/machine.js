const express = require('express');
const router = express.Router();
const MachineController = require('../Controllers/MachineController');
const checkAuth = require("../MiddleWare/check-auth");

const MachineControllerinst = new MachineController();
router.post("/add", function (req, res, next) {
    MachineControllerinst.add(req, res, next);
});
router.get("/find", function (req, res, next) {
    MachineControllerinst.find(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    MachineControllerinst.update(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    MachineControllerinst.get(req, res, next);
});
module.exports = router;
