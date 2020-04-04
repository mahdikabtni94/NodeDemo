'use strict';
module.exports = function (sequelize, DataTypes) {
    const order = sequelize.define('order', {
            order_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            order_label: {
                type: DataTypes.STRING,

            },
            order_code: {
                type: DataTypes.STRING,

            },
            order_description: {
                type: DataTypes.STRING,

            },
            ArticleId: {
                allowNull: true,
                type: DataTypes.INTEGER,

            },


        }, {
            tableName: 'orders'
        }
    );

    const article = require('./articles');
    const bundle = require('./bundle');

    order.prototype.modelIncludes = {
        'article': {
            model: article
        },
        'bundle': {
            model: bundle
        },
    };
    order.prototype.getModelIncludes = function () {
        return ['article','bundle'];
    };
    order.associate = function (models) {
        // associations can be defined here1
        order.belongsTo(models.article, {foreignKey: 'ArticleId'});
        order.hasMany(models.bundle, {foreignKey: 'OrderId'});


    };
    return order;

};

