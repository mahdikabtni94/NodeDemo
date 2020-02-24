
module.exports = (sequelize, type) => {
    const Product = sequelize.define('Product', {
            Product_id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            label: {
                type: type.STRING,
                allowNull: false,

            }, description: {
                type: type.STRING,
                allowNull: true,
            }
        }, {
            tableName: 'produits'

        },
    );
    const CategoryModel = require("./Category");
    Product.prototype.modelIncludes = {
        include: [{
            model: CategoryModel,

        }]
    };
    Product.getModelIncludes = function () {
        return Product.modelIncludes;
    };
    Product.associate = function (models, asscoationTab) {
        // associations can be defined here
        Product.belongsToMany(models, {
            through: asscoationTab, unique: false, as :'categories'
        });
    };

    return Product;

};
