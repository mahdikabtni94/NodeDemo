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


    return has_permissions;

};

