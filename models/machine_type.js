'use strict';
module.exports = function (sequelize, DataTypes) {
    const machine_type = sequelize.define('machine_type', {
            machinetype_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING,

            },
            description: {
                type: DataTypes.STRING,
            }

        }, {
            tableName: 'machine_types'
        }
    );
    const machine = require('./machine');
    const operation = require('./operation');

    machine_type.prototype.modelIncludes = {
        'machine': {
            model: machine
        },
        'operation': {
            model: operation
        },

    };
    machine_type.prototype.getModelIncludes = function () {
        return ['machine','operation'];
    };
    machine_type.associate = function (models) {
        // associations can be defined here
        machine_type.hasMany(models.machine, {foreignKey: 'MachineTypeId'});
        machine_type.hasMany(models.operation, {foreignKey: 'MachineTypeId'});

    };
    return machine_type;

};

