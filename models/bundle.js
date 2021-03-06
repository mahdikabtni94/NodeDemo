module.exports = function (sequelize, DataTypes) {
    var bundle = sequelize.define('bundle', {
            bundle_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            num_bundle: {
                type: DataTypes.INTEGER,

            },
            code: {
                type: DataTypes.STRING,

            },
            version: {
                type: DataTypes.INTEGER,
                allowNull: true,

            },
            size: {
                type: DataTypes.STRING,

            },
            quantity: {
                type: DataTypes.INTEGER,

            },
            CreatedAt: {
                type: DataTypes.DATE,

            },
            Start_date: {
                type: DataTypes.DATE,

            },
            finish_date: {
                type: DataTypes.DATE,

            },
            OrderId: {
                allowNull: true,
                type: DataTypes.INTEGER,

            },

        }, {
            tableName: 'bundles'

        },
    );
    const order = require('./order');
    const operation = require('./operation');
    const line = require('./line');
    const cart_pending_operation = require ('./cart_pending_operation');

    bundle.prototype.modelIncludes = {
        'order': {
            model: order
        },
        'operation': {
            model: operation
        },
        'line': {
            model: line
        },
        'cart_pending_operation': {
            model: cart_pending_operation
        }
    };
    bundle.prototype.getModelIncludes = function () {
        return ['order', 'operation', 'line','cart_pending_operation'];
    };
    bundle.associate = function (models) {
        // associations can be defined here1
        bundle.belongsTo(models.order, {foreignKey: 'OrderId'});
        bundle.belongsToMany(models.line, {
            through: 'lines_bundles', foreignKey: 'BundleId'
        });

        bundle.hasMany(models.operation,{foreignKey: 'BundleId'});
        bundle.hasMany(models.cart_pending_operation,{foreignKey: 'BundleId'});


    };

    return bundle;

};
