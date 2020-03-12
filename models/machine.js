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
                type: DataTypes.STRING,
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
    machine.prototype.modelIncludes = {
        'line': {
            model: line
        },
        'machine_type': {
            model: machinetype
        },
        'box' :{
            model : box
        }

    };
    machine.prototype.getModelIncludes = function () {
        return ['line', 'machine_type','box'];
    };
    machine.associate = function (models) {
        // associations can be defined here
        machine.belongsTo(models.machine_type, {foreignKey: 'MachineTypeId'});
        machine.belongsTo(models.line, {foreignKey: 'LineId'});
        machine.hasOne(models.box, {foreignKey: 'MachineId'});

    };
    return machine;

};

