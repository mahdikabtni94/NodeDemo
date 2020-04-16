const BaseApiController = require('./BaseApiController');
let db = require('../models');

class EmployeeController extends BaseApiController {

    constructor() {
        super('employee');
        this.baseModel = 'employee';
        this.primary_key = 'emp_id';
    }

    addOperator(req, res, next) {
        var job = 'operator';
        db.job.findOne({
            where: {
                job_label: job
            }
        }).then(function (job) {
            let operator = db.employee.build();
            operator.emp_name = req.body.emp_name;
            operator.emp_lastname = req.body.emp_lastname;
            operator.emp_gender = req.body.emp_gender;
            operator.start_working_date = req.body.start_working_date;
            operator.emp_address = req.body.emp_address;
            operator.emp_rfid = req.body.emp_rfid;
            operator.city = req.body.city;
            operator.emp_age = req.body.emp_age;
            operator.emp_matricule = req.body.emp_matricule;
            operator.profile_image = req.body.profile_image;
            operator.JobId = job.job_id;
            operator.save().then(CreatedModel => {

                res.json({
                    message: 'Operator added succesfully',
                    data: CreatedModel,

                })
            })
        }).catch(err =>
            res.status(500).json(err)
        )

    }

    addSupervisor(req, res, next) {
        var job = 'supervisor';
        db.job.findOne({
            where: {
                job_label: job
            }
        }).then(function (job) {
            let operator = db.employee.build();
            operator.emp_name = req.body.emp_name;
            operator.emp_lastname = req.body.emp_lastname;
            operator.emp_gender = req.body.emp_gender;
            operator.start_working_date = req.body.start_working_date;
            operator.emp_address = req.body.emp_address;
            operator.emp_rfid = req.body.emp_rfid;
            operator.city = req.body.city;
            operator.emp_age = req.body.emp_age;
            operator.emp_matricule = req.body.emp_matricule;
            operator.profile_image = req.body.profile_image;
            operator.JobId = job.job_id;
            operator.save().then(CreatedModel => {

                res.json({
                    message: 'Supervisor added succesfully',
                    data: CreatedModel,

                })
            })
        }).catch(err =>
            res.status(500).json(err)
        )

    }

    addElectronic(req, res, next) {
        var job = 'electronic';
        db.job.findOne({
            where: {
                job_label: job
            }
        }).then(function (job) {
            let operator = db.employee.build();
            operator.emp_name = req.body.emp_name;
            operator.emp_lastname = req.body.emp_lastname;
            operator.emp_gender = req.body.emp_gender;
            operator.start_working_date = req.body.start_working_date;
            operator.emp_address = req.body.emp_address;
            operator.emp_rfid = req.body.emp_rfid;
            operator.city = req.body.city;
            operator.emp_age = req.body.emp_age;
            operator.emp_matricule = req.body.emp_matricule;
            operator.profile_image = req.body.profile_image;
            operator.JobId = job.job_id;
            operator.save().then(CreatedModel => {

                res.json({
                    message: 'Electronic added succesfully',
                    data: CreatedModel,

                })
            })
        }).catch(err =>
            res.status(500).json(err)
        )

    }

    addMechanic(req, res, next) {
        var job = 'mechanic';
        db.job.findOne({
            where: {
                job_label: job
            }
        }).then(function (job) {
            let operator = db.employee.build();
            operator.emp_name = req.body.emp_name;
            operator.emp_lastname = req.body.emp_lastname;
            operator.emp_gender = req.body.emp_gender;
            operator.start_working_date = req.body.start_working_date;
            operator.emp_address = req.body.emp_address;
            operator.emp_rfid = req.body.emp_rfid;
            operator.city = req.body.city;
            operator.emp_age = req.body.emp_age;
            operator.emp_matricule = req.body.emp_matricule;
            operator.profile_image = req.body.profile_image;
            operator.JobId = job.job_id;
            operator.save().then(CreatedModel => {

                res.json({
                    message: 'Mechanic added succesfully',
                    data: CreatedModel,

                })
            })
        }).catch(err =>
            res.status(500).json(err)
        )

    }


    findOperators(req, res, next) {

        if (!this.db[this.baseModel]) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.ModelNotDefined'
            })
        }

        this.db[this.baseModel].findAll().then(
            result => {
                let includesQuery = [];
                if (result[0].getModelIncludes && result[0].getModelIncludes()) {
                    result[0].getModelIncludes().forEach(includeItem => {
                        if (this.db[includeItem]) {
                            includesQuery.push({
                                model: this.db[includeItem],
                                required: false,
                            });
                        }
                    })

                }
                var job = 'operator';
                db.job.findOne({
                    where: {
                        job_label: job
                    }
                }).then(function (job) {
                    db.employee.findAll({
                        where: {
                            JobId: job.job_id

                        },
                        include: includesQuery
                    }).then(resFind => {
                        res.json({
                            message: 'success',
                            data: resFind,
                            status: 1,
                        })
                    })
                })


            }).catch(err =>
            res.status(500).json(err)
        )

    }

    findSupervisors(req, res, next) {

        if (!this.db[this.baseModel]) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.ModelNotDefined'
            })
        }

        this.db[this.baseModel].findAll().then(
            result => {
                let includesQuery = [];
                if (result[0].getModelIncludes && result[0].getModelIncludes()) {
                    result[0].getModelIncludes().forEach(includeItem => {
                        if (this.db[includeItem]) {
                            includesQuery.push({
                                model: this.db[includeItem],
                                required: false,
                            });
                        }
                    })

                }
                var job = 'supervisor';
                db.job.findOne({
                    where: {
                        job_label: job
                    }
                }).then(function (job) {
                    db.employee.findAll({
                        where: {
                            JobId: job.job_id

                        },
                        include: includesQuery
                    }).then(resFind => {
                        res.json({
                            message: 'success',
                            data: resFind,
                            status: 1,
                        })
                    })
                })


            }).catch(err =>
            res.status(500).json(err)
        )

    }

    findMechanics(req, res, next) {

        if (!this.db[this.baseModel]) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.ModelNotDefined'
            })
        }

        this.db[this.baseModel].findAll().then(
            result => {
                let includesQuery = [];
                if (result[0].getModelIncludes && result[0].getModelIncludes()) {
                    result[0].getModelIncludes().forEach(includeItem => {
                        if (this.db[includeItem]) {
                            includesQuery.push({
                                model: this.db[includeItem],
                                required: false,
                            });
                        }
                    })

                }
                var job = 'mechanic';
                db.job.findOne({
                    where: {
                        job_label: job
                    }
                }).then(function (job) {
                    db.employee.findAll({
                        where: {
                            JobId: job.job_id

                        },
                        include: includesQuery
                    }).then(resFind => {
                        res.json({
                            message: 'success',
                            data: resFind,
                            status: 1,
                        })
                    })
                })


            }).catch(err =>
            res.status(500).json(err)
        )

    }
    findElectronics(req, res, next) {

        if (!this.db[this.baseModel]) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.ModelNotDefined'
            })
        }

        this.db[this.baseModel].findAll().then(
            result => {
                let includesQuery = [];
                if (result[0].getModelIncludes && result[0].getModelIncludes()) {
                    result[0].getModelIncludes().forEach(includeItem => {
                        if (this.db[includeItem]) {
                            includesQuery.push({
                                model: this.db[includeItem],
                                required: false,
                            });
                        }
                    })

                }
                var job = 'electronic';
                db.job.findOne({
                    where: {
                        job_label: job
                    }
                }).then(function (job) {
                    db.employee.findAll({
                        where: {
                            JobId: job.job_id

                        },
                        include: includesQuery
                    }).then(resFind => {
                        res.json({
                            message: 'success',
                            data: resFind,
                            status: 1,
                        })
                    })
                })


            }).catch(err =>
            res.status(500).json(err)
        )

    }
}

module.exports = EmployeeController;
