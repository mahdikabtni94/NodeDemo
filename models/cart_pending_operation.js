'use strict';
module.exports = function (sequelize, DataTypes) {
    const cart_pending_operation = sequelize.define('cart_pending_operation', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            BundleId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            OperationId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },

            finished: {
                type: DataTypes.INTEGER
            },
            inProgess: {
                type: DataTypes.STRING
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            Start_date: {
                type: DataTypes.DATE,
                defaultValue: null
            },
            Finish_date: {
                type: DataTypes.DATE,
                defaultValue: null
            },
            reparation: {
                type: DataTypes.INTEGER
            },
            time: {
                type: DataTypes.INTEGER
            },



        }, {
            tableName: 'cart_pending_operations'
        }
    );

    const operation = require('./operation');
    const bundle = require('./bundle');
    const cart_pending_session = require('./cart_pending_session');
    cart_pending_operation.prototype.modelIncludes = {

        'operation': {
            model: operation
        },
        'bundle': {
            model: bundle
        },
        'cart_pending_session': {
            model: cart_pending_session
        },


    };
    cart_pending_operation.prototype.getModelIncludes = function () {
        return ['operation', 'bundle', 'cart_pending_session', 'machine'];
    };
    cart_pending_operation.associate = function (models) {
        // associations can be defined here
        cart_pending_operation.belongsTo(models.operation, {foreignKey: 'OperationId'});
        cart_pending_operation.belongsTo(models.bundle, {foreignKey: 'BundleId'});
        cart_pending_operation.hasMany(models.cart_pending_session, {foreignKey: 'CartPendingOperationId'});


    };
    return cart_pending_operation;

};

