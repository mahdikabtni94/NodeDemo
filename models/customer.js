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
            city: {
                type: DataTypes.STRING
            },
        CountryId : {
            allowNull: true,
            type: DataTypes.INTEGER
        }



        }, {
            tableName: 'Customers'
        }
    );
     const country = require('./country');
     customer.prototype.modelIncludes = {
       'country': {
            model: country
        }
    };
     customer.prototype.getModelIncludes = function() {
         return ['country'];
     };
    customer.associate = function (models) {
        // associations can be defined here
        customer.belongsTo(models.country, {foreignKey: 'CountryId'});
    };
    return customer;

};

