module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,

            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,


            },
            Name: {
                type: DataTypes.STRING
            },
            Username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,


            },
            Phone: {
                type: DataTypes.STRING,
                allowNull: true

            },
            Address: {
                type: DataTypes.STRING,


            },
            permissions: DataTypes.VIRTUAL,
            City: {
                type: DataTypes.STRING,
            },
            user: {
                type: DataTypes.STRING,

            },
            Activated: {
                type: DataTypes.BOOLEAN,
                defaultValue: '0'
            },
            ClientId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            ProfileId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }

        },
        {
            tableName: 'Users'
        });

    const profile = require('./profile');
    const customer = require('./customer');
    user.prototype.modelIncludes = {
        'profile': {
            model: profile
        },
        'customer': {
            model: customer
        },


    };
    user.prototype.getModelIncludes = function () {
        return ['profile', 'customer'];
    };
    user.associate = function (models) {
        // associations can be defined here1
        user.belongsTo(models.profile, {foreignKey: 'ProfileId'});
        user.belongsTo(models.customer, {foreignKey: 'ClientId'});


    };
    return user
};
