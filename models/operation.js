'use strict';
module.exports = function (sequelize, DataTypes) {
    const operation = sequelize.define('operation', {
            operation_id: {
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
                type: DataTypes.INTEGER,

            },
            accMinPrice: {
                type: DataTypes.INTEGER,
            },
            BundleId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
        sequences: DataTypes.VIRTUAL


        }, {
            tableName: 'operations'
        }
    );
    const machinetype = require('./machine_type');
    const line = require('./line');
    const bundle = require('./bundle');
    const cart_pending_operation = require ('./cart_pending_operation');
    const sequence_operation = require('./sequence_operation');
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
        'cart_pending_operation':{
            model: cart_pending_operation
        },
        'sequence_operation' :{
            model: sequence_operation
        }


    };
    operation.prototype.getModelIncludes = function () {
        return ['machine_type', 'line', 'bundle','cart_pending_operation','sequence_operation'];
    };
    operation.associate = function (models) {
        // associations can be defined here
        operation.belongsTo(models.machine_type, {foreignKey: 'MachineTypeId'});
        operation.belongsToMany(models.line, {through: 'operations_lines', foreignKey: 'OperationId'});
        operation.hasMany(models.sequence_operation, { foreignKey: 'operation_id'});
        operation.belongsTo(models.bundle, {foreignKey: 'BundleId'});
        operation.hasOne(models.cart_pending_operation, {foreignKey: 'OperationId'});


    };
    return operation;

};

