const express = require('express');
const router = express.Router();
const CustomerController = require('../Controllers/CustomerController');
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
        cb(error, "images");
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

const CustomerControllerinst = new CustomerController();
router.post("/add",multer({storage: storage}).single('image') ,function (req, res, next) {
   CustomerControllerinst.addCustomer(req, res, next);
});
router.get("/find", function (req, res, next) {
    CustomerControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    CustomerControllerinst.get(req, res, next);
});
router.put("/update/:id",multer({storage: storage}).single('image'), function (req, res, next) {
    CustomerControllerinst.UpdateCustomer(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    CustomerControllerinst.delete(req, res, next);
});
module.exports = router;
