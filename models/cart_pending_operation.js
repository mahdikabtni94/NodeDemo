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
                type: DataTypes.INTEGER
            },


        }, {
            tableName: 'cart_pending_operations '
        }
    );

    const operation = require('./operation');
    const bundle = require('./bundle');
    cart_pending_operation.prototype.modelIncludes = {

        'operation': {
            model: operation
        },
        'bundle': {
            model: bundle
        }


    };
    cart_pending_operation.prototype.getModelIncludes = function () {
        return ['operation', 'bundle'];
    };
    cart_pending_operation.associate = function (models) {
        // associations can be defined here
        cart_pending_operation.belongsTo(models.operation, {foreignKey: 'OperationId'});
        cart_pending_operation.belongsTo(models.bundle, {foreignKey: 'BundleId'});


    };
    return cart_pending_operation;

};

