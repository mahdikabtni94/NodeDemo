
module.exports = function (sequelize, DataTypes) {
    var article =  sequelize.define('article', {
            article_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            article_name :{
                type : DataTypes.STRING,
            },

           code: {
                type : DataTypes.STRING,
                allowNull : true,

            },
            description :{
                type : DataTypes.STRING,
                allowNull:  true,


            }},{
            tableName : 'articles'

        },
    );
    const order = require('./order');
    const operation_template = require('./operation_template');

    article.prototype.modelIncludes = {
        'order': {
            model: order
        },
        'operation_template': {
            model: operation_template
        },
    };
    article.prototype.getModelIncludes = function () {
        return ['order','operation_template'];
    };
    article.associate = function (models) {
        // associations can be defined here1
        article.hasMany(models.order, {foreignKey: 'ArticleId'});
        article.belongsToMany(models.operation_template, {
            through: 'has_operations', foreignKey :'ArticleId'});


    };

    return article;

};
