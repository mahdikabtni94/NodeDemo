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
                type: DataTypes.STRING,

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
            profile_image: {
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

    employee.prototype.modelIncludes = {
        'job': {
            model: job
        },

    };
    employee.prototype.getModelIncludes = function () {
        return ['job'];
    };
    employee.associate = function (models) {
        // associations can be defined here
        employee.belongsTo(models.job, {foreignKey: 'JobId'});

    };
    return employee;

};

