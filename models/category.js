module.exports = function (sequelize, DataTypes) {
    const category = sequelize.define('category', {
            category_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            label: {
                type: DataTypes.STRING,
                allowNull: false,

            },
        }, {
            tableName: 'categories'

        },
    );

    const Products = require("./product");
    category.prototype.modelIncludes = {
        'Products': {
            model: Products
        },
    };

    category.prototype.getModelIncludes = function () {
        return ['Products'];
    };

    category.associate = function (models) {
        // associations can be defined here
        category.belongsToMany(models.product, {
            through: 'category_Prod',  as: 'products',unique: false,
        });
    };

    return category;
};
