'use strict';
module.exports = function (sequelize, DataTypes) {
    const permission = sequelize.define('permission', {
            permission_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            permission_label: {
                type: DataTypes.STRING,

            },
            level: {
                type: DataTypes.INTEGER,
            },
            parent_menu: {
                type: DataTypes.INTEGER,
            },

        }, {
            tableName: 'permissions'
        }
    );

    const profile = require('./profile');

    permission.prototype.modelIncludes = {
        'profile': {
            model: profile
        },
    };
    permission.prototype.getModelIncludes = function () {
        return ['profile'];
    };
    permission.associate = function (models) {
        // associations can be defined here1
        permission.belongsToMany(models.profile, {
                through: 'has_permissions', foreignKey :'PermissionId'});


    };
    return permission;

};

