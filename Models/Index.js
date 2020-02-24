const Sequelize = require('sequelize');
const config = require('../DataBaseConfig/Config');
const UserModel = require("./User");
const ArticleModel = require("./articles");
const Product = require("./Products");
const Category = require("./Category");


const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


const User = UserModel(sequelize, Sequelize);
const Article = ArticleModel(sequelize, Sequelize);
const produit = Product(sequelize, Sequelize);
const category = Category(sequelize, Sequelize);
const CategoProd = sequelize.define('Category_Prod', {});
produit.associate(category, CategoProd);
category.associate(produit, CategoProd);


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


sequelize.sync({force: true})
    .then(() => {
        console.log(`Database & tables created!`)
    });


module.exports = {
    User: User,
    Article: Article,
    Produit: produit,
    Category: category,
};



