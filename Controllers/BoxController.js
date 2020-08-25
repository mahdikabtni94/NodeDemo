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
                                'where cpo.BundleId = ' + cpo.BundleId

                            _this.db.sequelize.query(allOperationsSQL,
                                {type: _this.db.sequelize.QueryTypes.SELECT})
                                .then(operationCount => {
                                    console.log('all operations = ', operationCount[0].count)

                                    let sql = 'select count(cpo.*) \n' +
                                        'from cart_pending_operations cpo\n' +
                                        'where cpo.BundleId = ' + cpo.BundleId + ' and cpo.Start_date is null'

                                    _this.db.sequelize.query(sql,
                                        {type: _this.db.sequelize.QueryTypes.SELECT})
                                        .then(cpo_not_started => {

                                            if (cpo_not_started[0].count === operationCount[0].count) {
                                                _this.db['bundle'].update({
                                                    Start_date: new Date(starttime * 1000),

                                                }, {
                                                    where: {
                                                        bundle_id: cpo.BundleId
                                                    }
                                                })
                                            }
                                        })

                                })
                            this.db['cart_pending_operation'].update({
                                inProgess: 'Y',
                                quantity: 0,
                                Start_date: new Date(starttime * 1000)

                            }, {
                                where: {

                                    id: cpo_id,

                                }
                            })
                        } else {
                            this.db['cart_pending_operation'].update({
                                inProgess: 'Y',
                                Start_date: new Date(starttime * 1000)

                            }, {
                                where: {

                                    cart_pending_operation_id: cpo_id,
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
                                created_at: new Date(starttime * 1000).getTime(),
                                quantity: 0,
                                in_progress: 'Y',
                                active: 'Y',
                                start_time: new Date(starttime * 1000).getTime()
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
                        Finish_date: new Date(endtime * 1000).getTime(),
                        in_progress: 'N'
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
                            end_time: new Date(endtime * 1000),
                            in_progress: 'N'
                        }, {
                            where: {
                                id: cps.id
                            }
                        }).then(cpsUpdated => {

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
                        Finish_date: new Date(endtime * 1000).getTime(),
                        in_progress: 'N'
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
                                'where cpo.BundleId = ' + cpo.BundleId

                            _this.db.sequelize.query(allOperationSQL, {
                                type: _this.db.sequelize.QueryTypes.SELECT
                            })
                                .then(count_allOperations => {

                                    let allOperationSQL = 'select count(cpo.*) from cart_pending_operations cpo ' +
                                        'where cpo.BundleId = ' + cpo.BundleId + ' and cpo.finished = 1'

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

                                                quantity: quantity,
                                                time: time,
                                                end_time: new Date(endtime * 1000).getTime(),
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
                        'where cps.CartPendingOperationId = ' + cps.CartPendingOperationId
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
                                in_progress: 'N',
                                time: time,
                                Finish_date: new Date(endtime * 1000).getTime()
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
                                        'where cpo.BundleId = ' + cpo.BundleId

                                    _this.db.sequelize.query(allOperationSQL, {
                                        type: _this.db.sequelize.QueryTypes.SELECT
                                    })
                                        .then(count_allOperations => {

                                            let allOperationSQL = 'select count(cpo.*) from cart_pending_operations cpo ' +
                                                'where cpo.BundleId = ' + cpo.BundleId + ' and cpo.finished = 1'

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
                                                        end_time: new Date(endtime * 1000).getTime(),
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
                                                        cps.reparation = reparation
                                                        cps.quantity = total;
                                                        cps.time = time;
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
                cartPendingOperation.operation.sequences = []

                _this.findOperationSequence2(cartPendingOperation).then(resultFinOpSeq => {
                    cartPendingOperation.operation.sequences = resultFinOpSeq.operation.sequences;
                    generatedCpoSequences++;
                    if (generatedCpoSequences >= cartPendingOperations.length) {
                        resolve(cartPendingOperations);
                    }
                })


                i++;
            })
        })
    }


    findOperationSequence2(cartPendingOperation) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.findOperationSequence(cartPendingOperation.operation).then(operation => {

                cartPendingOperation.operation.sequences = operation.sequences;
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
                    OperationId: operation.operation_id
                },
                order: [
                    ['sequence_order', 'ASC']
                ]
            }).then(operationSequences => {


                operation.sequences = [];
                let i = 0;
                operationSequences.forEach(function (s) {
                    operation.sequences.push(s);
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



}


module.exports = BoxController;
