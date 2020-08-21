const {Op} = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const BaseApiController = require('./BaseApiController');
const EmailPassword = 'farfour33';
const Email = 'mahdi.kabtni@esprit.tn';
let db = require('../models');

class userController extends BaseApiController {

    constructor() {
        super('user');
        this.baseModel = 'user';

    }


    adduser(req, res, next) {
        const password = JSON.parse(JSON.stringify({pass: "marabout"}));
        console.log(password.pass);
        console.log("error", req.body);
        bcrypt.hash(password.pass, 10).then(hash => {

            const user = db.user.build();
            user.email = req.body.email;
            user.password = hash;
            user.Username = req.body.Username;
            user.Name = req.body.Name;
            user.Address = req.body.Address;
            user.Phone = req.body.Phone;
            user.City = req.body.City;
            user.ProfileId = req.body.ProfileId;
            user.ClientId = req.body.ClientId;
            if (req.body.Activated === true){
                user.Activated = true
            }
            else {
                user.Activated = false;
            }
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
                    message: 'user Added Successfully!!',
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

    loginuser(req, res, next) {

        let fetcheduser;
        if ((!req.body.email || !req.body.password) && (!req.body.Username)) {
            return res.status(401).json({
                message: "No params sended"
            });
        }


        if (req.body.email && req.body.password) {
            db.user.findOne({
                include: [{
                    model: db.profile,
                }],
                where: {
                    email: req.body.email
                }
            }).then(user => {
                    if (!user) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if (user.Activated === false){
                        return  res.status(401).json({
                            message :"Account not Activated"
                        });
                    }
                    fetcheduser = user;
                    const validPassword = bcrypt.compareSync(req.body.password, user.password);
                    if (!validPassword) {
                        return res.status(401).json({
                            message: "Wrong Password"
                        });
                    } else {
                        db.has_permissions.findAll({

                            include: [{
                                model: db.permission,
                            }],
                            where: {
                                ProfileId: fetcheduser.profile.profile_id,
                            }
                        }).then(function (permissions) {
                            fetcheduser.permissions = [];
                            permissions.forEach(permission => {
                                fetcheduser.permissions.push(permission.permission.permission_label);
                            });
                            const token = jwt.sign(
                                {
                                    email: fetcheduser.email,
                                    userId: fetcheduser.user_id,
                                    permissions: fetcheduser.permissions,
                                    profile : fetcheduser.profile,
                                    Username :fetcheduser.Username
                                },
                                "secret_this_should_be_longer",
                                {expiresIn: "1h"}
                            );
                            res.json({
                                message: 'Success',
                                user: fetcheduser.toJSON(),
                                success: true,
                                token: token,
                                permissions: permissions,
                                expiresIn: 3600
                            });
                        })
                    }
                })
                .catch(err => {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                });

        } else if (req.body.Username && req.body.password) {
            db.user.findOne({
                where: {
                    [Op.or]: [

                        {Username: req.body.Username}
                    ],

                }
            })
                .then(user => {
                    if (!user) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    fetcheduser = user;
                    const validPassword = bcrypt.compareSync(req.body.password, user.password);
                    if (!validPassword) {
                        return res.status(401).json({
                            message: "Wrong Password"
                        });
                    } else {
                        const token = jwt.sign(
                            {email: fetcheduser.email, userId: fetcheduser.user_id},
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


    confirmuserAccount(req, res, next) {
        const EMAIL_SECRET = "secret_this_should_be_longer";
        const decodeToken = jwt.verify(req.params.token, EMAIL_SECRET);
        const token = req.params.token;
        const userReset = decodeToken.user_id;

        const where = {}
        where[this.getModelPrimaryKey()] = decodeToken.user_id;
        try {
            db.user.update(
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
                db.user.update(
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
        let fetcheduser;
        if (!req.body.email) {
            return res.status(401).json({
                message: "No params sended"
            });
        }
        db.user.findOne({
            where: {
                [Op.or]: [

                    {email: req.body.email}
                ],

            }
        }).then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "user Doesnt Exist"
                });
            }
            fetcheduser = user;
            const token = jwt.sign(
                {user_id: fetcheduser.user_id},
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

    Activateuser(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;
        try {
            db.user.update(
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

    Deactivateuser(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;
        try {
            db.user.update(
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

module.exports = userController;
