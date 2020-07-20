'use strict';
module.exports = function (sequelize, DataTypes) {
    const machine_operation_template = sequelize.define('machine_operation_template', {
            machine_operation_template_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            MachineId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            OperationTemplateId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'machine_operation_templates'
        }
    );
    const machine = require('./machine');
    const operation_template = require('./operation_template');
    machine_operation_template.prototype.modelIncludes = {
        'machine': {
            model: machine
        },
        'operation_template': {
            model: operation_template
        },


    };
    machine_operation_template.prototype.getModelIncludes = function () {
        return ['machine', 'operation_template'];
    };
    machine_operation_template.associate = function (models) {
        // associations can be defined here1
        machine_operation_template.belongsTo(models.machine, {foreignKey: 'MachineId'});
        machine_operation_template.belongsTo(models.operation_template, {foreignKey: 'OperationTemplateId'});


    };



    return machine_operation_template;

};

