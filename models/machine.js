'use strict';
module.exports = function (sequelize, DataTypes) {
    const machine = sequelize.define('machine', {
            machine_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            machine_label: {
                type: DataTypes.STRING,

            },
            startworkingdate: {
                type: DataTypes.DATEONLY,
            },
            manifacturerlifetime: {
                type: DataTypes.STRING,
            },
            LineId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            MachineTypeId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'machines'
        }
    );
   const machinetype = require('./machine_type');
   const line = require('./line');
   const box = require('./box');
   const operation_tempalate= require('./operation_template');
    machine.prototype.modelIncludes = {
        'line': {
            model: line
        },
        'machine_type': {
            model: machinetype
        },
        'box' :{
            model : box
        },
        'operation_template' : {
            model : operation_tempalate
        }

    };
    machine.prototype.getModelIncludes = function () {
        return ['line', 'machine_type','box','operation_template'];
    };
    machine.associate = function (models) {
        // associations can be defined here1
        machine.belongsTo(models.machine_type, {foreignKey: 'MachineTypeId'});
        machine.belongsTo(models.line, {foreignKey: 'LineId'});
        machine.hasOne(models.box, {foreignKey: 'MachineId'});
        machine.belongsToMany(models.operation_template,{
            through: 'machine_operation_template', foreignKey:'MachineId'});

    };
    return machine;

};

