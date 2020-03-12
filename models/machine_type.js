'use strict';
module.exports = function (sequelize, DataTypes) {
    const machinetype = sequelize.define('machine_type', {
            machinetype_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            machinetype_type: {
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

    machinetype.prototype.modelIncludes = {
        'machine': {
            model: machine
        },

    };
    machinetype.prototype.getModelIncludes = function () {
        return ['machine'];
    };
    machinetype.associate = function (models) {
        // associations can be defined here
        machinetype.hasMany(models.machine, {foreignKey: 'MachineTypeId'});

    };
    return machinetype;

};

