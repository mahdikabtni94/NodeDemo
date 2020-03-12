'use strict';
module.exports = function (sequelize, DataTypes) {
    const box = sequelize.define('box', {
            box_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
           box_label: {
                type: DataTypes.STRING,

            },
           address_mac: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.STRING
            },
            version: {
                type: DataTypes.STRING
            },

            MachineId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            SiteId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },


        }, {
            tableName: 'boxs'
        }
    );
    const machine = require('./machine');
    const site = require('./site');
    box.prototype.modelIncludes = {
        'machine': {
            model: machine
        },
        'site': {
            model : site
        }
    };
    box.prototype.getModelIncludes = function () {
        return ['machine', 'site'];
    };
    box.associate = function (models) {
        // associations can be defined here
        box.belongsTo(models.machine, {foreignKey: 'MachineId'});
        box.belongsTo(models.site, {foreignKey: 'SiteId'});

    };
    return box;

};

