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
    country.prototype.modelIncludes = {
        'customers': {
            model: customer
        }
    };
    country.prototype.getModelIncludes = function() {
        return ['customers'];
    };

    country.associate = function (models) {
        // associations can be defined here
        country.hasMany(models.customer);
    };
    return country;


};
