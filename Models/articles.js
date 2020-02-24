
module.exports = (sequelize, type) => {
   const Article =  sequelize.define('article', {
        article_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        label: {
            type : type.STRING,
            allowNull : false,

        },
        description :{
            type : type.STRING,
            allowNull:  true,


        }},{
        tableName : 'articles'

    },
   );

   return Article;

};
