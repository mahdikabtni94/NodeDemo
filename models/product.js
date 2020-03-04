
module.exports = function (sequelize, DataTypes) {
    const product = sequelize.define('product', {
            product_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            label: {
                type: DataTypes.STRING,
                allowNull: false,

            }, description: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        }, {
            tableName: 'produits'

        },
    );
    const CategoryModel = require("./Category");
    product.prototype.modelIncludes = {
        'Categories': {
            model: CategoryModel
        }
    };
    product.getModelIncludes = function () {
        return ['Categories'];
    };
    product.associate = function (models) {
        // associations can be defined here
        product.belongsToMany(models.category, {
            through:'Category_Prod', unique: false, as :'categories'
        });
    };

    return product;

};
