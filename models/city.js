module.exports = function (sequelize, DataTypes) {
    const city = sequelize.define('city', {
            city_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            city_name: {
                type: DataTypes.STRING,

            },
            StateId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'cities'
        }
    );
    const state = require('./state');
    city.prototype.modelIncludes = {
        'state': {
            model: state
        },
    };
    city.prototype.getModelIncludes = function () {
        return ['state'];
    };

    city.associate = function (models) {
        // associations can be defined here
        city.belongsTo(models.state, {foreignKey: 'StateId'});
    };
    return city;


};
