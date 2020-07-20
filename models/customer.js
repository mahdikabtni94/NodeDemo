'use strict';
module.exports = function (sequelize, DataTypes) {
    const customer = sequelize.define('customer', {
            client_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            client_name: {
                type: DataTypes.STRING,

            },
            address: {
                type: DataTypes.STRING
            },
            phoneNumber: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING
            },
            technical_contact: {
                type: DataTypes.STRING
            },
            sales_contact: {
                type: DataTypes.STRING

            },
            fax: {
                type: DataTypes.STRING
            },
            picpath: {
                type: DataTypes.STRING
            },
            CountryId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            StateId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            CityId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'Customers'
        }
    );
    const country = require('./country');
    const state = require('./state');
    const city = require('./city');
    const site = require('./site');
    const user = require('./user');
    const order = require('./order');

    customer.prototype.modelIncludes = {
        'country': {
            model: country
        },
        'state': {
            model: state
        },
        'city': {
            model: city
        },
        'site': {
            model: site
        },
        'user': {
            model: user
        },
        'order': {
            model: order
        }
    };
    customer.prototype.getModelIncludes = function () {
        return ['country', 'state', 'city', 'site', 'user','order'];
    };
    customer.associate = function (models) {
        // associations can be defined here
        customer.belongsTo(models.country, {foreignKey: 'CountryId'});
        customer.belongsTo(models.city, {foreignKey: 'CityId'});
        customer.belongsTo(models.state, {foreignKey: 'StateId'});
        customer.hasMany(models.site, {foreignKey: 'ClientId'});
        customer.hasMany(models.user, {foreignKey: 'ClientId'});
        customer.hasMany(models.order, {foreignKey: 'CustomerId'});
    };
    return customer;

};

