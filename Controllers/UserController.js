const {Op} = require("sequelize");
const bcrypt = require('bcrypt');
const Model = require('../Models/Index');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const BaseApiController = require('./BaseApiController');
const EmailPassword = 'farfour33';
const Email = 'mahdi.kabtni@esprit.tn';

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
                    {user_id: result.user_id},
                    "secret_this_should_be_longer",
                    {expiresIn: "1h"}
                );
                const url = 'http://localhost:3000/confirmation/' + emailtoken;
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: Email,
                        pass: EmailPassword
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

    confirmUserAccount(req, res, next) {
        const EMAIL_SECRET = "secret_this_should_be_longer";
        const decodeToken = jwt.verify(req.params.token, EMAIL_SECRET);
        const token = req.params.token;
        const userReset = decodeToken.user_id;

        const where = {}
        where[this.getModelPrimaryKey()] = decodeToken.user_id;
        try {
            Model.User.update(
                {Activated: true},
                {where: where}
            )

        } catch (e) {
            res.send(e);

        }
        return res.redirect('http://localhost:4200/resetPassword/' + token);


    }

    resetPassword(req, res, next) {
        const EMAIL_SECRET = "secret_this_should_be_longer";
        const where = {};
        const token = req.params.token;
        const decodeToken = jwt.verify(token, EMAIL_SECRET);
        const id = decodeToken.user_id;
        where[this.getModelPrimaryKey()] = id;
        bcrypt.hash(req.body.password, 10).then(hash => {
            try {
                Model.User.update(
                    {password: hash},
                    {where: where}
                )
            } catch (e) {
                res.send(e);
                hash

            }
            return res.status(200).json({
                message: 'password reset',
                password: hash
            })
        });


    }

    ResetEmail(req, res, next) {
        const EMAIL_SECRET = "secret_this_should_be_longer";
        let fetchedUser;
        if (!req.body.email) {
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
        }).then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "User Doesnt Exist"
                });
            }
            fetchedUser = user;
            const token = jwt.sign(
                {user_id: fetchedUser.user_id},
                EMAIL_SECRET,
                {expiresIn: "1h"}
            );
            const url = 'http://localhost:3000/confirmation/' + token;
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    user: Email,
                    pass: EmailPassword
                }
            });
            transporter.sendMail({
                to: req.body.email,
                subject: 'Marabout Password Reset',
                html: `Please click this link To change your Email: <a href="${url}">${url}</a>`,
            });
            return res.status(200).json({
                token: token,
                expiresIn: 3600,
                message: 'An Email has being sent to your Address'
            });


        }).catch(err => {
            return res.status(401).json({
                message: "An Error has Occurred while sending Email"
            });
        });


    }

    ActivateUser(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;
        try {
            Model.User.update(
                {Activated: true},
                {where: where}
            )
        } catch (e) {
            res.send(e);


        }
        return res.status(200).json({
            message: 'AccountActivated',
        })

    }

    DeactivateUser(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;
        try {
            Model.User.update(
                {Activated: false},
                {where: where}
            )
        } catch (e) {
            res.send(e);


        }
        return res.status(200).json({
            message: 'AccountDeactivated',
        })

    }


}

module.exports = UserController;
