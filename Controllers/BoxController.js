const BaseApiController = require('./BaseApiController');
const moment = require('moment');

class BoxController extends BaseApiController {

    constructor() {
        super('box');
        this.baseModel = 'box';
        this.primary_key = 'box_id';
    }

    authAction(req, res, next) {
        let _this = this;
        var db = require('../models');
        var rt = moment().format("YYYY-MM-DD HH:mm:ss");
        var rfid = req.params.rfid;
        var addr = req.params.source_addr;
        var box_ip = req.params.box_ip;
        var box_version = req.params.box_version;

        if (addr === null || addr === '') {
            res.send({
                success: false,
                messages: [
                    {
                        userMessage: 'Invalid source address data',
                        internalMessage: 'Invalid source address data',
                        code: 1002
                    }
                ]
            });
            return;
        }
        if (rfid === null || rfid === '') {
            res.send({
                success: false,
                messages: [
                    {
                        userMessage: 'Invalid RFID data',
                        internalMessage: 'Invalid RFID data',
                        code: 1001
                    }
                ]
            });
            return;
        }
        if (box_ip === null || box_ip === '' || box_ip === undefined || box_ip === 'undefined') {


            res.send({
                success: false,
                messages: [
                    {
                        userMessage: 'Invalid Box IP data',
                        internalMessage: 'Invalid Box IP data',
                        code: 1047
                    }
                ]
            });
            return;
        }

        if (box_version === null || box_version === '' || box_version === undefined || box_version === 'undefined') {
            res.send({
                success: false,
                messages: [
                    {
                        userMessage: 'Invalid Box version',
                        internalMessage: 'Invalid Box version',
                        code: 1048
                    }
                ]
            });
            return;
        }


        _this.db['employee'].findOne({
            where: {
                emp_rfid: rfid

            },
            include: [
                {
                    model: db['job']
                }
            ]
        }).then(user => {

                _this.db['box'].findOne({
                    include: [{
                        model: db['machine']
                    }],
                    where: {
                        address_mac: addr
                    }
                }).then(box => {
                        if (user && box && box.machine) {

                            _this.db['usersession'].findOne({
                                where:
                                    {
                                        EmployeeId:
                                            {
                                                $eq: user.emp_id
                                            },
                                        time_out: null,
                                    },
                                include: [
                                    {
                                        model: _this.db['box']
                                    }
                                ]
                            }).then(old_usersession => {

                                if (old_usersession) {
                                    return res.send({
                                        success: false,
                                        data: old_usersession,
                                        messages: [
                                            {
                                                userMessage: "You are already connected from another box [" + old_usersession.box.box_label + "], please log out of the previous session",
                                                internalMessage: "You are already connected from another box, please log out of the previous session",
                                                code: 1055
                                            }
                                        ]
                                    });

                                } else {
                                    // new userSerssion
                                    _this.db['box'].update({
                                            box_ip: box_ip,
                                        },
                                        {
                                            where: {
                                                address_mac: addr
                                            }
                                        }
                                    );

                                    _this.db['usersession'].build({
                                        time_in: rt,
                                        EmployeeId: user.emp_id,
                                        BoxId: box.box_id,

                                    }).save().then(result1 => {
                                        var result111 = {};
                                        _this.db['usersession'].findOne({
                                            where: {
                                                usersession_id: result1.usersession_id
                                            },
                                            include: [
                                                {
                                                    model: db['employee'],

                                                    include: [
                                                        {
                                                            model: db['job']
                                                        }
                                                    ]
                                                },
                                                {
                                                    model: db['box'],
                                                    include: [
                                                        {
                                                            model: db['machine']
                                                        },
                                                        {
                                                            model: db['line'],

                                                        }
                                                    ]
                                                }
                                            ]
                                        }).then(user_session => {
                                            _this.db['employee'].update({
                                                last_login_date: rt,
                                                where: {
                                                    emp_rfid: rfid

                                                },
                                                include: [
                                                    {
                                                        model: db['job']
                                                    }
                                                ]
                                            });
                                            res.send({
                                                message: 'Employee is connected',
                                                success: true,
                                                data: user_session,
                                                code: 1049
                                            })

                                        })
                                    });
                                }
                            })

                        } else if (user && !box) {
                            res.send(
                                {
                                    success: false,
                                    data: null,
                                    messages: [
                                        {
                                            userMessage: "Box not Found",
                                            internalMessage: "Box not Found",
                                            code: 1017,
                                        }
                                    ],
                                    attributes: [],
                                    status: 500
                                }
                            );
                            return;

                        } else {
                            res.send(
                                {
                                    success: false,
                                    data: null,
                                    messages: [
                                        {
                                            "userMessage": "Rfid not exists",
                                            "internalMessage": "Rfid not exists",
                                            "code": 1004
                                        }
                                    ],
                                    attributes: [],
                                    status: 500
                                }
                            );
                            return;
                        }
                    }
                )
            }
        )
    }

}

module.exports = BoxController;
