'use strict';
module.exports = function (sequelize, DataTypes) {
    const employee = sequelize.define('employee', {
            emp_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            emp_name: {
                type: DataTypes.STRING,

            },
            emp_lastname: {
                type: DataTypes.STRING,

            },
            emp_gender: {
                type: DataTypes.STRING,

            },
            start_working_date: {
                type: DataTypes.DATE,

            },
            last_login_date: {
                type: DataTypes.DATE,
            },
            emp_address: {
                type: DataTypes.STRING,

            },
            emp_rfid: {
                type: DataTypes.STRING
            },
            city: {
                type: DataTypes.STRING
            },
            emp_age: {
                type: DataTypes.STRING

            },
            emp_matricule: {
                type: DataTypes.STRING

            },
            status: {
                type: DataTypes.STRING
            },
            profile_image: {
                type: DataTypes.STRING

            },
            email: {
                type: DataTypes.STRING

            },
            JobId: {
                allowNull: true,
                type: DataTypes.INTEGER

            },


        }, {
            tableName: 'employees'
        }
    );
    const job = require('./job');
    const cart_pending_session = require('./cart_pending_session');
    const usersession = require('./usersession');

    employee.prototype.modelIncludes = {
        'job': {
            model: job
        },
        'cart_pending_session': {
            model: cart_pending_session
        },
        'usersession': {
            model: usersession
        },

    };
    employee.prototype.getModelIncludes = function () {
        return ['job', 'cart_pending_session','usersession'];
    };
    employee.associate = function (models) {
        // associations can be defined here
        employee.belongsTo(models.job, {foreignKey: 'JobId'});
        employee.hasOne(models.usersession,{foreignKey:'EmployeeId'});
        employee.hasMany(models.cart_pending_session, {foreignKey: 'EmployeeId'});

    };
    return employee;

};

