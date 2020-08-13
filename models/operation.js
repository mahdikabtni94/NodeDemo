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
                type: DataTypes.STRING,

            },
            accMinPrice: {
                type: DataTypes.STRING
            },
            BundleId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },



        }, {
            tableName: 'operations '
        }
    );
    const machinetype = require('./machine_type');
    const line = require('./line');
    const bundle = require('./bundle');
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



    };
    operation.prototype.getModelIncludes = function () {
        return ['machine_type', 'line', 'bundle'];
    };
    operation.associate = function (models) {
        // associations can be defined here
        operation.belongsTo(models.machine_type, {foreignKey: 'MachineTypeId'});
        operation.belongsToMany(models.line, {through: 'operations_lines', foreignKey: 'OperationId'});
        operation.belongsTo(models.bundle,{foreignKey: 'BundleId'} );



    };
    return operation;

};

