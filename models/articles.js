
module.exports = function (sequelize, DataTypes) {
   var Article =  sequelize.define('articles', {
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

   return Article;

};
