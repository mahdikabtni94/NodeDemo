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
        var rfid = req.query.rfid;
        var addr = req.query.source_addr;
        var box_ip = req.query.box_ip;
        var box_version = req.query.box_version;

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
                console.log("userrrrrrrrrrr", user);

                _this.db['box'].findOne({
                    include: [{
                        model: db['machine']
                    }],
                    where: {
                        address_mac: addr
                    }
                }).then(box => {
                        console.log("boxxxxxxxxxxx", box);
                        if (user && box && box.machine) {

                            _this.db['usersession'].findOne({
                                where:
                                    {
                                        EmployeeId: user.emp_id,
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
                                                },
                                                {
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

    logout(req, res, next) {

        var db = require('../models');

        var usersession_id = req.params.usersession_id;

        var rt = moment().format("YYYY-MM-DD HH:mm:ss");
        if (usersession_id === null || usersession_id === '') {

            res.send({
                success: false,
                data: null,
                messages: [
                    {
                        userMessage: 'Invalid user session data',
                        internalMessage: 'Invalid user session data',
                        code: 1006
                    }
                ]
            });
            return;

        }

        db['usersession'].findOne({
            where: {
                usersession_id: usersession_id
            }
        }).then(usersessions => {

            if (usersessions) {

                //1. Close usersession

                db['usersession'].update(
                    {
                        time_out: rt,
                    },
                    {
                        where: {
                            usersession_id: usersession_id
                        }
                    });

                //2. Close CPS

                db['cart_pending_session'].findAll({
                    where: {
                        UserSessionId: usersession_id
                    }
                }).then(cart_pending_sessions => {

                    cart_pending_sessions.forEach(function (cps) {

                        if (cps.updated_at === null) {

                            db['cart_pending_session'].update(
                                {
                                    updated_at: rt,
                                    end_time: rt //////////////////////////////////////////////
                                },
                                {
                                    where: {
                                        UserSessionId: cps.UserSessionId,
                                        end_time: null
                                    }
                                });

                        }

                    })

                    res.send({
                        "success": true,
                        "data": null,
                        "messages": [
                            {
                                userMessage: "Logout successful",
                                internalMessage: "Logout successful",
                                code: 1018,
                                more_info: null
                            }
                        ],
                        "attributes": [],
                        "status": 200
                    });
                    return;

                })


            } else {

                res.send({
                    success: false,
                    data: null,
                    messages: [
                        {
                            userMessage: 'User session not exists',
                            internalMessage: 'User session not exists',
                            code: 1008
                        }
                    ]
                });
                return;

            }

        })

    }

    startOperation(req, res, next) {

        let cpo_id = req.query.cpo_id;
        let usersession_id = req.query.usersession_id;
        var starttime = moment().format("YYYY-MM-DD HH:mm:ss");

        var _this = this;

        if ((cpo_id == null) || (cpo_id == '')) {
            res.send({
                success: false,
                data: null,
                messages: [{
                    userMessage: 'CPO_ID not provided',
                    internalMessage: 'CPO_ID not provided',
                    code: 7002
                }]
            });
            return;
        }


        if ((starttime == null) || (starttime == '')) {
            res.send({
                success: false,
                data: null,
                messages: [{
                    userMessage: 'Start time not provided',
                    internalMessage: 'Start time not provided',
                    code: 1025
                }]
            });
            return;
        }

        if ((usersession_id == null) || (usersession_id == '')) {
            res.send({
                success: false,
                data: null,
                messages: [{
                    userMessage: 'User session does not exists',
                    internalMessage: 'User session does not exists',
                    code: 1008
                }]
            });
            return;
        }

        _this.db['usersession'].findOne({

            where: {
                usersession_id: usersession_id,
                time_out: null
            }

        }).then(usersession => {

            if (usersession) {

                _this.db['cart_pending_operation'].findOne({

                    where: {
                        id: cpo_id
                    },
                    include: [
                        {
                            model: _this.db['bundle']
                        }
                    ]


                }).then(cpo => {


                    if (cpo) {

                        if (Number(cpo.quantity) === 0) {

                            let allOperationsSQL = 'select count(cpo.*) \n' +
                                'from cart_pending_operations cpo\n' +
                                'where cpo."BundleId" = :bundle_id'

                            _this.db.sequelize.query(allOperationsSQL,
                                {
                                    type: _this.db.sequelize.QueryTypes.SELECT,
                                    replacements: {
                                        bundle_id: cpo.BundleId
                                    }
                                })
                                .then(operationCount => {
                                    console.log('all operations = ', operationCount[0])

                                    let sql = 'select count(cpo.*) \n' +
                                        'from cart_pending_operations cpo\n' +
                                        'where cpo."BundleId" = :bundle_id and "Start_date" is  null'

                                    _this.db.sequelize.query(sql,
                                        {
                                            type: _this.db.sequelize.QueryTypes.SELECT,
                                            replacements: {
                                                bundle_id: cpo.BundleId
                                            }
                                        })
                                        .then(cpo_not_started => {
                                            console.log('cpoooooooooooo', cpo_not_started);
                                            if (cpo_not_started[0].count === operationCount[0].count) {
                                                _this.db['bundle'].update({
                                                    Start_date: starttime,

                                                }, {
                                                    where: {
                                                        bundle_id: cpo.BundleId
                                                    }
                                                })
                                            }
                                        })

                                }).catch(err => {
                                console.error(err)
                            });
                            this.db['cart_pending_operation'].update({
                                inProgess: 'Y',
                                quantity: 0,
                                Start_date: starttime

                            }, {
                                where: {

                                    id: cpo_id,

                                }
                            })
                        } else {
                            this.db['cart_pending_operation'].update({
                                inProgess: 'Y',
                                Start_date: starttime

                            }, {
                                where: {

                                    id: cpo_id,
                                }
                            })
                        }
                        this.db['cart_pending_session'].update({
                                active: 'N',
                            },
                            {
                                where: {
                                    UserSessionId: usersession_id,
                                    CartPendingOperationId: cpo_id,
                                    end_time: null,
                                    active: 'Y'
                                }
                            }).then(result1 => {
                            var modalObj = _this.db['cart_pending_session'].build({
                                UserSessionId: usersession_id,
                                CartPendingOperationId: cpo_id,
                                created_at: starttime,
                                quantity: 0,
                                in_progress: 'Y',
                                active: 'Y',
                                start_time: starttime
                            });

                            modalObj.save()
                                .then(cps => {

                                    if (cps) {
                                        res.send({
                                            success: true,
                                            data: cps,
                                            messages: [{
                                                userMessage: 'Start operation with success',
                                                internalMessage: 'Start operation with success',
                                                code: 4003
                                            }]
                                        });
                                        return;
                                    } else {
                                        res.send({
                                            success: false,
                                            data: null,
                                            messages: [{
                                                userMessage: 'Failed to create operation',
                                                internalMessage: 'Failed to create operation',
                                                code: 4009
                                            }]
                                        });
                                        return;
                                    }


                                });
                        })


                    } else {
                        res.send({
                            success: false,
                            data: null,
                            messages: [{
                                userMessage: 'Cart Pending Operation does not exists',
                                internalMessage: 'Cart Pending Operation does not exists',
                                code: 7003
                            }]
                        });
                        return;
                    }

                });

            } else {
                res.send({
                    success: false,
                    data: null,
                    messages: [{
                        userMessage: 'User session does not exists',
                        internalMessage: 'User session does not exists',
                        code: 1008
                    }]
                });
                return;
            }

        })
    }

    operationFinished(req, res, next) {

        let cps_id = req.query.cps_id;
        let quantity = req.query.quantity;
        let time = req.query.time;
        let endtime = moment().format("YYYY-MM-DD HH:mm:ss");

        if ((cps_id == null) || (cps_id == '')) {
            res.send({
                success: false,
                data: null,
                messages: [{
                    userMessage: 'CPS_ID not provided',
                    internalMessage: 'CPS_ID not provided',
                    code: 7000
                }]
            });
            return;
        }

        if ((quantity == null) || (quantity == '')) {
            res.send({
                success: false,
                data: null,
                messages: [{
                    userMessage: 'Quantity not provided',
                    internalMessage: 'Quantity not provided',
                    code: 1022
                }]
            });
            return;
        }

        if ((time == null) || (time == '')) {
            res.send({
                success: false,
                data: null,
                messages: [{
                    userMessage: 'Time not provided',
                    internalMessage: 'Time not provided',
                    code: 1023
                }]
            });
            return;
        }

        if ((endtime == null) || (endtime == '')) {
            res.send({
                success: false,
                data: null,
                messages: [{
                    userMessage: 'End time not provided',
                    internalMessage: 'End time not provided',
                    code: 1026
                }]
            });
            return;
        }

        var _this = this;


        _this.db['cart_pending_session'].findOne({
            where: {
                id: cps_id,
                end_time: null
            },
            include: [{
                model: _this.db['cart_pending_operation'],
                include: [{
                    model: _this.db['operation']
                }]
            },
                {
                    model: _this.db['usersession'],
                    include: [{
                        model: _this.db['box'],
                        include: [{
                            model: _this.db['machine']
                        }]
                    }]
                }]
        }).then(cps => {
            if (cps) {


                var cps = cps;
                var quantity_operation = cps.cart_pending_operation.operation.quantity;

                if (cps.cart_pending_operation.quantity === '' || cps.cart_pending_operation.quantity === null) {
                    var quantity_CPO = 0;
                } else {
                    var quantity_CPO = cps.cart_pending_operation.quantity;
                }
                var total_quantity = 0;
                total_quantity = parseInt(quantity_CPO) + parseInt(quantity);
                time = parseInt((cps.cart_pending_operation.time) ? cps.cart_pending_operation.time : 0) + parseInt(time);


                if (quantity < quantity_operation && total_quantity < quantity_operation) {

                    _this.db['cart_pending_operation'].update({
                        quantity: total_quantity,
                        finished: 0,
                        time: time,
                        inProgess: 'N'
                    }, {
                        where: {
                            id: cps.cart_pending_operation.id,
                        }
                    }).then(cpo_updated => {
                        cps.cart_pending_operation.quantity = total_quantity;
                        cps.cart_pending_operation.finished = 0;
                        cps.cart_pending_operation.time = time;

                        cps.quantity = quantity;
                        cps.time = time;


                        _this.db['cart_pending_session'].update({

                            quantity: quantity,
                            time: time,
                            end_time: endtime,
                            in_progress: 'N'
                        }, {
                            where: {
                                id: cps.id
                            }
                        }).then(cpsUpdated => {
                            cps.end_time = endtime;
                            cps.in_progress = 'N';

                            res.send({
                                success: true,
                                data: cps,
                                messages: [{
                                    userMessage: 'Operation already updated and finished',
                                    internalMessage: 'Operation already updated and finished',
                                    code: 4006
                                }]
                            });
                            return;
                        });


                    })


                } else if (total_quantity === quantity_operation) {
                    //finished

                    _this.db['cart_pending_operation'].update({

                        quantity: total_quantity,
                        finished: 1,
                        time: time,
                        Finish_date: endtime,
                        inProgess: 'N'
                    }, {
                        where: {
                            id: cps.cart_pending_operation.id
                        }
                    }).then(cpoUpdated => {

                        // --update Bundles

                        _this.db['cart_pending_operation'].findOne({
                            where: {
                                id: cps.cart_pending_operation.id
                            }
                        }).then(cpo => {

                            let allOperationSQL = 'select count(cpo.*) from cart_pending_operations cpo ' +
                                'where cpo."BundleId" = ' + cpo.BundleId

                            _this.db.sequelize.query(allOperationSQL, {
                                type: _this.db.sequelize.QueryTypes.SELECT
                            })
                                .then(count_allOperations => {
                                    console.log('all operationssssss', count_allOperations[0]);

                                    let allOperationSQL = 'select count(cpo.*) from cart_pending_operations cpo ' +
                                        'where cpo."BundleId" = ' + cpo.BundleId + ' and cpo.finished = 1'

                                    _this.db.sequelize.query(allOperationSQL, {
                                        type: _this.db.sequelize.QueryTypes.SELECT
                                    })
                                        .then(finished_operations_count => {
                                            console.log('finishedopsssssssssss', finished_operations_count[0]);
                                            if (count_allOperations[0].count === finished_operations_count[0].count) {

                                                _this.db['bundle'].update({

                                                    finish_date: new Date(endtime * 1000)
                                                }, {
                                                    where: {
                                                        bundle_id: cpo.bundle_id
                                                    }
                                                })
                                            }


                                            _this.db['cart_pending_session'].update({

                                                quantity: quantity,
                                                time: time,
                                                end_time: endtime,
                                                in_progress: 'N'

                                            }, {
                                                where: {
                                                    id: cps.id,
                                                    end_time: null
                                                }
                                            }).then(cpsUpdated => {

                                                cps.cart_pending_operation.quantity = total_quantity;
                                                cps.cart_pending_operation.finished = 1;
                                                cps.cart_pending_operation.time = time;

                                                cps.quantity = quantity;
                                                cps.time = time;
                                                cps.in_progress = 'N';
                                                cps.end_time = endtime;


                                                res.send({
                                                    success: true,
                                                    data: cps,
                                                    messages: [{
                                                        userMessage: 'Operation already updated and finished',
                                                        internalMessage: 'Operation already updated and finished',
                                                        code: 4006
                                                    }]
                                                });
                                                return;
                                            });

                                        })

                                })
                        })


                    });


                } else {
                    let sql = 'select sum(cps.quantity) as cps_quantity, sum(cps.reparation) as total_reparation from cart_pending_sessions as cps \n ' +
                        'where cps."CartPendingOperationId" = ' + cps.CartPendingOperationId
                    _this.db.sequelize.query(sql,
                        {type: _this.db.sequelize.QueryTypes.SELECT})
                        .then(cps_quantity => {
                            let total = parseInt(quantity_operation) - parseInt(cps_quantity[0].cps_quantity);
                            let reparation = quantity - total;
                            let cpo_reparation = 0;
                            if (parseInt(cps_quantity[0].cps_quantity) !== null) {
                                cpo_reparation = parseInt(cps_quantity[0].total_reparation)
                            }

                            _this.db['cart_pending_operation'].update({
                                reparation: cpo_reparation + reparation,
                                quantity: quantity_operation,
                                finished: 1,
                                inProgess: 'N',
                                time: time,
                                Finish_date: endtime
                            }, {
                                where: {
                                    id: cps.cart_pending_operation.id
                                }
                            }).then(cpoUpdated => {

                                // --update Bundles

                                _this.db['cart_pending_operation'].findOne({
                                    where: {
                                        id: cps.cart_pending_operation.id
                                    }
                                }).then(cpo => {

                                    let allOperationSQL = 'select count(cpo.*) from cart_pending_operations cpo ' +
                                        'where cpo."BundleId" = ' + cpo.BundleId

                                    _this.db.sequelize.query(allOperationSQL, {
                                        type: _this.db.sequelize.QueryTypes.SELECT
                                    })
                                        .then(count_allOperations => {

                                            let allOperationSQL = 'select count(cpo.*) from cart_pending_operations cpo ' +
                                                'where cpo."BundleId" = ' + cpo.BundleId + ' and cpo.finished = 1'

                                            _this.db.sequelize.query(allOperationSQL, {
                                                type: _this.db.sequelize.QueryTypes.SELECT
                                            })
                                                .then(finished_operations_count => {
                                                    if (count_allOperations[0].count === finished_operations_count[0].count) {
                                                        _this.db['bundle'].update({
                                                            finish_date: new Date(endtime * 1000)
                                                        }, {
                                                            where: {
                                                                bundle_id: cpo.bundle_id
                                                            }
                                                        })
                                                    }
                                                    _this.db['cart_pending_session'].update({
                                                        quantity: total,
                                                        time: time,
                                                        reparation: reparation,
                                                        end_time: endtime,
                                                        in_progress: 'N'

                                                    }, {
                                                        where: {
                                                            id: cps.id,
                                                            end_time: null
                                                        }
                                                    }).then(cpsUpdated => {
                                                        cps.cart_pending_operation.quantity = quantity_operation;
                                                        cps.cart_pending_operation.finished = 1;
                                                        cps.cart_pending_operation.time = time;
                                                        cps.reparation = reparation;
                                                        cps.quantity = total;
                                                        cps.time = time;
                                                        cps.in_progress = 'N';
                                                        cps.end_time = endtime;
                                                        res.send({
                                                            success: true,
                                                            data: cps,
                                                            messages: [{
                                                                userMessage: 'Operation already updated and finished',
                                                                internalMessage: 'Operation already updated and finished',
                                                                code: 4006
                                                            }]
                                                        });
                                                        return;
                                                    });
                                                })
                                        })
                                })
                            });

                        })
                }

            } else {
                res.send({
                    success: false,
                    data: null,
                    messages: [{
                        userMessage: 'CPS does not exists',
                        internalMessage: 'CPS does not exists',
                        code: 7001
                    }]
                });
                return;
            }

        });
    }

    dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === '-') {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    generateSequenceOperation(cartPendingOperations) {

        let _this = this;
        return new Promise(function (resolve, reject) {
            let i = 0;
            let generatedCpoSequences = 0;

            if (cartPendingOperations.length === 0) {
                resolve([])
                return;
            }
            cartPendingOperations.forEach(function (cartPendingOperation) {
                console.log('cartPendingOPPPPPPPP', cartPendingOperation);
                cartPendingOperation.operation.sequence_operations = [];

                _this.findOperationSequence2(cartPendingOperation).then(resultFinOpSeq => {
                    cartPendingOperation.operation.sequence_operations = resultFinOpSeq.operation.sequence_operations;
                    generatedCpoSequences++;
                    if (generatedCpoSequences >= cartPendingOperations.length) {
                        resolve(cartPendingOperations);
                    }
                });
                i++;
            })
        })
    }


    findOperationSequence2(cartPendingOperation) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.findOperationSequence(cartPendingOperation.operation).then(operation => {
                cartPendingOperation.operation.sequence_operations = operation.sequence_operations;
                resolve(cartPendingOperation);

            })
        })
    }

    findOperationSequence(operation) {
        let _this = this;

        return new Promise(function (resolve, reject) {

            //-*************************************************************************************************************
            _this.db['sequence_operation'].findAll({
                where: {
                    operation_id: operation.operation_id
                },
                order: [
                    ['sequence_order', 'ASC']
                ]
            }).then(operationSequences => {
                operation.sequence_operations = [];
                let i = 0;
                operationSequences.forEach(function (s) {
                    operation.sequence_operations.push(s);
                    i++;

                    if (i === operationSequences.length) {
                        resolve(operation)
                    }
                });
                if (operationSequences.length === 0) {
                    resolve(operation)
                }
            })


        })
    }

    getOperationList(req, res, next) {
        let _this = this;
        let usersession_id = req.query.usersession_id;
        let order_id = req.query.order_id;
        if ((usersession_id == null) || (usersession_id == '')) {
            res.send({
                success: false,
                data: null,
                messages: [
                    {
                        userMessage: 'User session does not exists',
                        internalMessage: 'User session does not exists',
                        code: 1008
                    }
                ]
            });
            return;
        }

        if ((order_id == null) || (order_id == '')) {
            res.send({
                success: false,
                data: null,
                messages: [
                    {
                        userMessage: 'Order_ID not provided',
                        internalMessage: 'Order_ID not provided',
                        code: 1050
                    }
                ]
            });
            return;
        }


        _this.db['usersession'].findOne({
            where: {
                usersession_id: usersession_id,
                time_out: null

            },
            include: [{
                model: _this.db['box'],
                include: [{
                    model: _this.db['machine'],
                    include: [{
                        model: _this.db['machine_type']
                    }]
                }]
            }]
        }).then(usersessions => {

            if (usersessions) {
                _this.db['box'].findOne({
                    where: {
                        box_id: usersessions.BoxId,
                    }
                }).then(boxes => {

                        if (boxes) {
                            _this.db['machine'].findOne({
                                where: {
                                    machine_id: boxes.MachineId,
                                }
                            }).then(machines => {
                                if (machines) {
                                    _this.db['machine_operation_template'].findAll({
                                        where: {
                                            MachineId: machines.machine_id,
                                        },
                                        include:[
                                            {
                                                model: this.db['operation_template']
                                            }
                                        ]
                                    })
                                        .then(machine_operation_templates => {
                                            if (machine_operation_templates.length > 0) {
                                                var promise1 = new Promise(function (resolve, reject) {
                                                    var cpo_result = [];
                                                    let i = 0;
                                                    machine_operation_templates.forEach(machine_operation_template_item => {
                                                        console.log('machineeeeeop',machine_operation_template_item);
                                                        _this.db['cart_pending_operation'].findAll({
                                                            where: {
                                                                '$operation.MachineTypeId$': machines.MachineTypeId,
                                                                finished: 0,
                                                                '$operation.op_code$': machine_operation_template_item.operation_template.op_code,
                                                                inProgess: 'N',
                                                                '$operation.bundle.OrderId$': order_id,
                                                            },
                                                            include: [
                                                                {
                                                                    model: _this.db['operation'],
                                                                    include: [
                                                                        {
                                                                            model: _this.db['bundle'],
                                                                            include: [{
                                                                                model: _this.db['order'],
                                                                            }]
                                                                        },

                                                                    ]
                                                                },

                                                            ],
                                                            order: [
                                                                ['BundleId', 'ASC']
                                                            ]
                                                        }).then(cartPendingOperations => {
                                                            console.log('cartopppppppppppp', cartPendingOperations);
                                                            if (cartPendingOperations) {
                                                                cpo_result.push(cartPendingOperations)
                                                            }
                                                            if (i === machine_operation_templates.length - 1) {
                                                                resolve(cpo_result)
                                                            }
                                                            i++
                                                        })
                                                        // setTimeout(resolve, 1000, cpo_result);
                                                    });
                                                });
                                                Promise.all([promise1]).then(function (cpo_result) {
                                                    console.log('cpoooooooooo',cpo_result[0]);
                                                    _this.generateSequenceOperation(cpo_result[0]).then(c => {
                                                        let cpo = c.sort(_this.dynamicSort('id'));
                                                        res.send({
                                                            success: true,
                                                            data: cpo[0],
                                                            status: 200
                                                        });
                                                    })
                                                })
                                            } else {
                                                res.send({
                                                    success: false,
                                                    data: null,
                                                    status: 500,
                                                    messages: [
                                                        {
                                                            userMessage: "You aren't trained in this machine",
                                                            internalMessage: "You aren't trained in this machine",
                                                        }
                                                    ],
                                                    code: 1046
                                                });
                                            }
                                        })
                                } else {
                                    res.json({
                                        success: false,
                                        data: null,
                                        userMessage: "Machine does not exist",
                                        attributes: [],
                                        status: 500,
                                        messages: [
                                            {
                                                userMessage: "Machine does not exist",
                                                internalMessage: "Machine does not exist",
                                            }
                                        ],
                                        code: 6006
                                    });
                                }
                            })
                        } else {
                            res.json({
                                success: false,
                                data: null,
                                userMessage: "Box not exist",
                                attributes: [],
                                status: 500,
                                messages: [
                                    {
                                        userMessage: "Box does not exists",
                                        internalMessage: "Box does not exists",
                                    }
                                ],
                                code: 1041
                            });
                        }
                    }
                ).catch(err =>
                    res.status(500).json(err)
                )
            } else {
                res.json({
                    success: false,
                    data: null,
                    userMessage: "User session not exists",
                    attributes: [],
                    status: 500,
                    messages: [
                        {
                            userMessage: "User session not exists",
                            internalMessage: "User session not exists",
                        }
                    ],
                    code: 1008
                });
            }
        })
    }


}


module.exports = BoxController;
