'use strict';
module.exports = function (sequelize, DataTypes) {
    const has_operations = sequelize.define('has_operations', {
            has_operations_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            OperationId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            ArticleId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },

        }, {
            tableName: 'has_operations'
        }
    );
    const operation_template = require('./operation_template');
    const article = require('./articles');
    has_operations.prototype.modelIncludes = {
        'operation_template': {
            model: operation_template
        },
        'article': {
            model: article
        },


    };
    has_operations.prototype.getModelIncludes = function () {
        return ['operation_template', 'article'];
    };
    has_operations.associate = function (models) {
        // associations can be defined here1
        has_operations.belongsTo(models.operation_template, {foreignKey: 'OperationId'});
        has_operations.belongsTo(models.article, {foreignKey: 'ArticleId'});


    };


    return has_operations;

};

