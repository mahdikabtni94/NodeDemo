'use strict';
module.exports = function (sequelize, DataTypes) {
    const usersession = sequelize.define('usersession', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            BoxId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            EmployeeId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            CartId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            time_in: {
                type: DataTypes.DATE
            },
            time_out: {
                type: DataTypes.DATE
            },


        }, {
            tableName: 'usersessions '
        }
    );

    const box = require('./box');
    const employee = require('./employee');
    const cart_pending_session = require('./cart_pending_session');
    usersession.prototype.modelIncludes = {

        'box': {
            model: box
        },
        'employee': {
            model: employee
        },
        'cart_pending_session': {
            model: cart_pending_session
        }


    };
    usersession.prototype.getModelIncludes = function () {
        return ['operation', 'employee','cart_pending_session'];
    };
    usersession.associate = function (models) {
        // associations can be defined here
        usersession.belongsTo(models.box, {foreignKey: 'BoxId'});
        usersession.belongsTo(models.employee, {foreignKey: 'EmployeeId'});
        usersession.belongsTo(models.cart_pending_session, {foreignKey: 'CartId'});


    };
    return usersession;

};

