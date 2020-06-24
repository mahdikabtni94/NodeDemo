'use strict';
module.exports = function (sequelize, DataTypes) {
    const has_permissions = sequelize.define('has_permissions', {
            has_permissions_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            ProfileId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            PermissionId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },

        }, {
            tableName: 'has_permissions'
        }
    );
    const profile = require('./profile');
    const permission = require('./permission');
    has_permissions.prototype.modelIncludes = {
        'profile': {
            model: profile
        },
        'permission': {
            model: permission
        },


    };
    has_permissions.prototype.getModelIncludes = function () {
        return ['profile', 'permission'];
    };
    has_permissions.associate = function (models) {
        // associations can be defined here1
        has_permissions.belongsTo(models.profile, {foreignKey: 'ProfileId'});
        has_permissions.belongsTo(models.permission, {foreignKey: 'PermissionId'});


    };


    return has_permissions;

};

