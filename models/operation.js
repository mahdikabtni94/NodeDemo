'use strict';
module.exports = function (sequelize, DataTypes) {
    const operation = sequelize.define('operation', {
            operation_template_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            label: {
                type: DataTypes.STRING,

            },
            op_code: {
                type: DataTypes.STRING,

            },
            description: {
                type: DataTypes.STRING,

            },
            MachineTypeId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            time: {
                type: DataTypes.STRING,

            },
            accMinPrice: {
                type: DataTypes.STRING
            },
            BundleId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            LineId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            quantity: {
                type: DataTypes.INTEGER
            },


        }, {
            tableName: 'operations '
        }
    );
    const machinetype = require('./machine_type');
    const line = require('./line');
    const bundle = require('./bundle');
    const cart_pending_operation =require('./cart_pending_operation');
    operation.prototype.modelIncludes = {

        'machine_type': {
            model: machinetype
        },
        'line': {
            model: line
        },
        'bundle': {
            model: bundle
        },
        'cart_pending_operation': {
            model: cart_pending_operation
        }


    };
    operation.prototype.getModelIncludes = function () {
        return ['machine_type', 'line', 'bundle','cart_pending_operation'];
    };
    operation.associate = function (models) {
        // associations can be defined here
        operation.belongsTo(models.machine_type, {foreignKey: 'MachineTypeId'});
        operation.belongsTo(models.line, {foreignKey: 'LineId'});
        operation.belongsTo(models.bundle, {foreignKey: 'BundleId'});
        operation.hasMany(models.cart_pending_operation, {foreignKey: 'OperationId'});


    };
    return operation;

};

