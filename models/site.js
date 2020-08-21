'use strict';
module.exports = function (sequelize, DataTypes) {
    const site = sequelize.define('site', {
            site_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            site_label: {
                type: DataTypes.STRING,

            },
            site_email: {
                type: DataTypes.STRING
            },
            site_phone: {
                type: DataTypes.STRING
            },
            site_technical_contact: {
                type: DataTypes.STRING
            },
            site_prod_contact: {
                type: DataTypes.STRING

            },
            site_fax: {
                type: DataTypes.STRING
            },
            site_address: {
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
            },
            ClientId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'Sites'
        }
    );
    const country = require('./country');
    const state = require('./state');
    const city = require('./city');
    const customer = require('./customer');

    site.prototype.modelIncludes = {
        'country': {
            model: country
        },
        'state': {
            model: state
        },
        'city': {
            model: city
        },
        'customer': {
            model: customer
        },

    };
    site.prototype.getModelIncludes = function () {
        return ['country', 'state', 'city', 'customer'];
    };
    site.associate = function (models) {
        // associations can be defined here
        site.belongsTo(models.country, {foreignKey: 'CountryId'});
        site.belongsTo(models.city, {foreignKey: 'CityId'});
        site.belongsTo(models.state, {foreignKey: 'StateId'});
        site.belongsTo(models.customer, {foreignKey: 'ClientId'});

    };
    return site;

};

