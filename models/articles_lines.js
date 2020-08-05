'use strict';
module.exports = function (sequelize, DataTypes) {
    const articles_lines = sequelize.define('articles_lines', {
            articles_lines_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            LineId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            ArticleId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },

        }, {
            tableName: 'articles_lines'
        }
    );
    const line = require('./line');
    const article = require('./articles');
    articles_lines.prototype.modelIncludes = {
        'line': {
            model: line
        },
        'article': {
            model: article
        },


    };
    articles_lines.prototype.getModelIncludes = function () {
        return ['line', 'article'];
    };
    articles_lines.associate = function (models) {
        // associations can be defined here1
        articles_lines.belongsTo(models.line, {foreignKey: 'LineId'});
        articles_lines.belongsTo(models.article, {foreignKey: 'ArticleId'});


    };


    return articles_lines;

};

