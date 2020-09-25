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
            const url = req.protocol + "://" + req.get("host");
            const imageURL = JSON.parse(JSON.stringify({url: url + "/emp-images/" + req.file.filename}));
            console.log("operator******", req.body);
            console.log("photo", imageURL.url);
            const operator = db.employee.build();
            operator.emp_name = req.body.emp_name;
            operator.emp_lastname = req.body.emp_lastname;
            operator.emp_gender = req.body.emp_gender;
            operator.start_working_date = req.body.start_working_date;
            if (req.body.last_login_date === 'undefined') {
                operator.last_login_date = null
            } else {
                operator.last_login_date = req.body.last_login_date;
            }

            operator.emp_address = req.body.emp_address;
            operator.emp_rfid = req.body.emp_rfid;
            if (req.body.city === 'undefined') {
                operator.city = null
            } else {
                operator.city = req.body.city;
            }
            operator.emp_age = req.body.emp_age;
            if (req.body.emp_matricule === 'undefined') {
                operator.emp_matricule = null
            } else {
                operator.emp_matricule = req.body.emp_matricule;
            }
            if (req.body.last_login_date === 'undefined') {
                operator.last_login_date = null
            } else {
                operator.last_login_date = req.body.last_login_date;
            }
            if (req.body.status === 'undefined') {
                operator.status = null
            } else {
                operator.status = req.body.status;
            }
            operator.email = req.body.email;
            operator.profile_image = imageURL.url;
            operator.JobId = job.job_id;

            operator.save().then(CreatedModel => {
                let _this = this;
                let whereQuery = {};
                whereQuery[_this.getModelPrimaryKey()] = CreatedModel[_this.getModelPrimaryKey()];
                let includesQuery = [];
                if (CreatedModel.getModelIncludes && CreatedModel.getModelIncludes()) {
                    CreatedModel.getModelIncludes().forEach(icludeItem => {
                        if (db[icludeItem]) {
                            includesQuery.push({
                                model: db[icludeItem],
                                required: false,
                            });
                        }
                    })
                }
                db.employee.findOne({
                    where: whereQuery,
                    include: includesQuery
                }).then(resFind => {
                    res.status(201).json({
                        message: 'Employee Added Successfully',
                        data:
                            {
                                resFind,

                            }
                    });

                })


            }).catch(err =>
                res.status(500).json(err)
            )

        })
    }

    addSupervisor(req, res, next) {
        var job = 'supervisor';
        db.job.findOne({
            where: {
                job_label: job
            }
        }).then(function (job) {
            const url = req.protocol + "://" + req.get("host");
            const imageURL = JSON.parse(JSON.stringify({url: url + "/emp-images/" + req.file.filename}));
            let operator = db.employee.build();
            operator.emp_name = req.body.emp_name;
            operator.emp_lastname = req.body.emp_lastname;
            operator.emp_gender = req.body.emp_gender;
            operator.start_working_date = req.body.start_working_date;
            operator.last_login_date = req.body.last_login_date;
            operator.emp_address = req.body.emp_address;
            operator.emp_rfid = req.body.emp_rfid;
            operator.city = req.body.city;
            operator.emp_age = req.body.emp_age;
            operator.emp_matricule = req.body.emp_matricule;
            operator.status = req.body.status;
            operator.email = req.body.email;
            operator.profile_image = imageURL.url;
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
            const url = req.protocol + "://" + req.get("host");
            const imageURL = JSON.parse(JSON.stringify({url: url + "/emp-images/" + req.file.filename}));
            let operator = db.employee.build();
            operator.emp_name = req.body.emp_name;
            operator.emp_lastname = req.body.emp_lastname;
            operator.emp_gender = req.body.emp_gender;
            operator.start_working_date = req.body.start_working_date;
            operator.last_login_date = req.body.last_login_date;
            operator.emp_address = req.body.emp_address;
            operator.emp_rfid = req.body.emp_rfid;
            operator.city = req.body.city;
            operator.emp_age = req.body.emp_age;
            operator.emp_matricule = req.body.emp_matricule;
            operator.profile_image = imageURL.url;
            operator.status = req.body.status;
            operator.email = req.body.email;
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
            const url = req.protocol + "://" + req.get("host");
            const imageURL = JSON.parse(JSON.stringify({url: url + "/emp-images/" + req.file.filename}));
            let operator = db.employee.build();
            operator.emp_name = req.body.emp_name;
            operator.emp_lastname = req.body.emp_lastname;
            operator.emp_gender = req.body.emp_gender;
            operator.start_working_date = req.body.start_working_date;
            operator.last_login_date = req.body.last_login_date;
            operator.emp_address = req.body.emp_address;
            operator.emp_rfid = req.body.emp_rfid;
            operator.city = req.body.city;
            operator.emp_age = req.body.emp_age;
            operator.emp_matricule = req.body.emp_matricule;
            operator.status = req.body.status;
            operator.profile_image = imageURL.url;
            operator.email = req.body.email;
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

    UpdateEmployee(req, res, next) {
        const where = {};
        let loginDate;
        let imagePath = req.body.profile_image;
        where[this.getModelPrimaryKey()] = req.params.id;
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = JSON.parse(JSON.stringify({url: url + "/emp-images/" + req.file.filename}));
        }
        if (req.body.last_login_date === 'undefined') {
            loginDate = null
        } else {
            loginDate = req.body.last_login_date;
        }
        db.employee.update(
            {
                emp_name: req.body.emp_name,
                emp_lastname: req.body.emp_lastname,
                emp_gender: req.body.emp_gender,
                start_working_date: req.body.start_working_date,
                last_login_date: loginDate,
                emp_address: req.body.emp_address,
                emp_rfid: req.body.emp_rfid,
                profile_image: imagePath.url,
                city: req.body.city,
                emp_age: req.body.emp_age,
                emp_matricule: req.body.emp_matricule,
                status: req.body.status,
                email: req.body.email
            },
            {where: where})
            .then(result => {
                console.log(result);
                res.status(200).json({message: 'Update Successful!', data: result});
            })

    }
}

module.exports = EmployeeController;
