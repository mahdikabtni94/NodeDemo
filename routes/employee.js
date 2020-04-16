const express = require('express');
const router = express.Router();
const EmployeeController = require('../Controllers/EmployeeController');
const checkAuth = require("../MiddleWare/check-auth");

const EmployeeControllerinst = new EmployeeController();
router.post("/add", function (req, res, next) {
    EmployeeControllerinst.add(req, res, next);
});
router.post("/addOperator", function (req, res, next) {
    EmployeeControllerinst.addOperator(req, res, next);
});
router.post("/addSupervisor", function (req, res, next) {
    EmployeeControllerinst.addSupervisor(req, res, next);
});
router.post("/addMechanic", function (req, res, next) {
    EmployeeControllerinst.addMechanic(req, res, next);
});
router.post("/addElectronic", function (req, res, next) {
    EmployeeControllerinst.addElectronic(req, res, next);
});

router.delete("/delete/;id", function (req, res, next) {
    EmployeeControllerinst.delete(req, res, next);
});
router.get("/find", function (req, res, next) {
    EmployeeControllerinst.find(req, res, next);
});
router.get("/findOperator", function (req, res, next) {
    EmployeeControllerinst.findOperators(req, res, next);
});
router.get("/findSupervisor", function (req, res, next) {
    EmployeeControllerinst.findSupervisors(req, res, next);
});
router.get("/findMechanic", function (req, res, next) {
    EmployeeControllerinst.findMechanics(req, res, next);
});
router.get("/findElectronic", function (req, res, next) {
    EmployeeControllerinst.findElectronics(req, res, next);
});


router.get("/find/:id", function (req, res, next) {
    EmployeeControllerinst.get(req, res, next);
});
router.put("/update/:id", function (req, res, next) {
    EmployeeControllerinst.update(req, res, next);
});

module.exports = router;
