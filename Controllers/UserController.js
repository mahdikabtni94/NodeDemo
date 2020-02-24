const {Op} = require("sequelize");
const bcrypt = require('bcrypt');
const Model = require('../Models/Index');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const BaseApiController = require('./BaseApiController');

class UserController extends BaseApiController {

    constructor() {
        super();
        this.baseModel = Model.User

    }


    adduser(req, res, next) {
        const password = JSON.parse(JSON.stringify({pass: "marabout"}));
        console.log(password.pass);
        console.log("error", req.body);
        bcrypt.hash(password.pass, 10).then(hash => {

            const user = new Model.User({
                email: req.body.email,
                password: hash,
                Username: req.body.Username,
                Name: req.body.Name,
                Address: req.body.Address,
                Phone: req.body.Phone,
                City: req.body.City,
                Profile: req.body.Profile,
                Activated: false
            });

            user.save().then(result => {
                const emailtoken = jwt.sign(
                    {userId: result.user_id},
                    "secret_this_should_be_longer",
                    {expiresIn: "1h"}
                );
                const url = 'http://localhost:3000/confirmation/' + emailtoken;
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'mahdi.kabtni@esprit.tn',
                        pass: 'farfour33'
                    }
                });
                transporter.sendMail({
                    to: result.email,
                    subject: 'Confirm Email',
                    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                });
                res.status(201).json({
                    message: 'User Added Successfully!!',
                    user: {
                        result: result,
                        id: result.user_id,

                    }

                });

            }).catch(err => {
                res.status(500).json({
                    message: 'error!!',
                    result: user


                })

            })
        });
    }

    loginUser(req, res, next) {

        let fetchedUser;
        if (!req.body.email || !req.body.password) {
            return res.status(401).json({
                message: "No params sended"
            });
        }


        Model.User.findOne({
            where: {
                [Op.or]: [

                    {email: req.body.email}
                ],

            }
        })
            .then(user => {
                if (!user) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                fetchedUser = user;
                const validPassword = bcrypt.compareSync(req.body.password, user.password);
                if (!validPassword) {
                    return res.status(401).json({
                        message: "Wrong Password"
                    });
                } else {
                    const token = jwt.sign(
                        {email: fetchedUser.email, userId: fetchedUser.user_id},
                        "secret_this_should_be_longer",
                        {expiresIn: "1h"}
                    );


                    return res.status(200).json({
                        token: token,
                        expiresIn: 3600
                    });
                }
            })
            .catch(err => {
                return res.status(401).json({
                    message: "Auth failed"
                });
            });
    }

}

module.exports = UserController;
