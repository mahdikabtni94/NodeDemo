module.exports = function (sequelize, DataTypes) {
    const country = sequelize.define('country', {
            country_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            country_name: {
                type: DataTypes.STRING,

            },



        }, {
            tableName: 'Country'
        }
    );
    const customer = require('./customer');
    const state = require('./state');
    country.prototype.modelIncludes = {
        'customer': {
            model: customer
        },
        'state': {
            model : state
        },

    };
    country.prototype.getModelIncludes = function() {
        return ['customer','state'];
    };

    country.associate = function (models) {
        // associations can be defined here
        country.hasMany(models.customer,{foreignKey: 'CountryId'});
        country.hasMany(models.state,{foreignKey:'CountryId'});
    };
    return country;


};
