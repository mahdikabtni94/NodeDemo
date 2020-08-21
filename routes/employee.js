const express = require('express');
const router = express.Router();
const EmployeeController = require('../Controllers/EmployeeController');
const checkAuth = require("../MiddleWare/check-auth");
const multer = require('multer');
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "images/employeeImages");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

const EmployeeControllerinst = new EmployeeController();
router.post("/add", function (req, res, next) {
    EmployeeControllerinst.add(req, res, next);
});
router.post("/addOperator",multer({storage: storage}).single('profile_image'), function (req, res, next) {
    EmployeeControllerinst.addOperator(req, res, next);
});
router.post("/addSupervisor",multer({storage: storage}).single('profile_image'), function (req, res, next) {
    EmployeeControllerinst.addSupervisor(req, res, next);
});
router.post("/addMechanic",multer({storage: storage}).single('profile_image'), function (req, res, next) {
    EmployeeControllerinst.addMechanic(req, res, next);
});
router.post("/addElectronic",multer({storage: storage}).single('profile_image'), function (req, res, next) {
    EmployeeControllerinst.addElectronic(req, res, next);
});

router.delete("/delete/:id", function (req, res, next) {
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
router.put("/update/:id",multer({storage: storage}).single('profile_image'), function (req, res, next) {
    EmployeeControllerinst.UpdateEmployee(req, res, next);
});

module.exports = router;
