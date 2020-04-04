
module.exports = function (sequelize, DataTypes) {
    var article =  sequelize.define('article', {
            article_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            label: {
                type : DataTypes.STRING,
                allowNull : false,

            },
            description :{
                type : DataTypes.STRING,
                allowNull:  true,


            }},{
            tableName : 'articles'

        },
    );
    const order = require('./order');

    article.prototype.modelIncludes = {
        'order': {
            model: order
        },
    };
    article.prototype.getModelIncludes = function () {
        return ['order'];
    };
    article.associate = function (models) {
        // associations can be defined here1
        article.hasMany(models.order, {foreignKey: 'ArticleId'});


    };

    return article;

};
