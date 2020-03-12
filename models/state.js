module.exports = function (sequelize, DataTypes) {
    const state = sequelize.define('state', {
            state_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            state_name: {
                type: DataTypes.STRING,

            },
            CountryId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'states'
        }
    );
    const country = require('./country');
    const city = require('./city');
    state.prototype.modelIncludes = {
        'country': {
            model: country
        },
        'city' : {
            model : city
        }
    };
    state.prototype.getModelIncludes = function () {
        return ['country','city'];
    };

    state.associate = function (models) {
        // associations can be defined here
        state.belongsTo(models.country, {foreignKey: 'CountryId'});
        state.hasMany(models.city,{foreignKey: 'StateId'});

    };
    return state;


};
