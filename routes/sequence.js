const express = require('express');
const router = express.Router();
const SequenceController = require('../Controllers/SequenceController');
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
        cb(error, "images/sequenceImages");
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

const sequenceControllerinst = new SequenceController();
router.post("/add",multer({storage: storage}).single('picture') ,function (req, res, next) {
    sequenceControllerinst.addSequence(req, res, next);
});
router.get("/find", function (req, res, next) {
    sequenceControllerinst.find(req, res, next);
});
router.get("/find/:id", function (req, res, next) {
    sequenceControllerinst.get(req, res, next);
});
router.get("/findByOp/:id", function (req, res, next) {
    sequenceControllerinst.FindByOperation(req, res, next);
});
router.put("/update/:id",multer({storage: storage}).single('picture'), function (req, res, next) {
    sequenceControllerinst.UpdateSequence(req, res, next);
});
router.delete("/delete/:id", function (req, res, next) {
    sequenceControllerinst.delete(req, res, next);
});
module.exports = router;
