'use strict';
module.exports = function (sequelize, DataTypes) {
    const profile = sequelize.define('profile', {
            profile_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            profile_label: {
                type: DataTypes.STRING,

            },
            profile_description: {
                type: DataTypes.STRING,
            },
            has_update: {
                type: DataTypes.STRING,
                defaultValue :'false'
            },
            has_delete: {
                type: DataTypes.STRING,
                defaultValue :'false'
            },
            has_save: {
                type: DataTypes.STRING,
                defaultValue :'false'
            }


        }, {
            tableName: 'profiles'
        }
    );

    const user = require('./user');
    const permission= require('./permission');
    profile.prototype.modelIncludes = {
        'user': {
            model: user
        },
        'permission': {
            model: permission
        },


    };
    profile.prototype.getModelIncludes = function () {
        return ['user','permission'];
    };
    profile.associate = function (models) {
        // associations can be defined here1
        profile.hasMany(models.user, {foreignKey: 'ProfileId'});
        profile.belongsToMany(models.permission, {
            through: 'has_permissions', foreignKey :'ProfileId'});


    };
    return profile;

};

