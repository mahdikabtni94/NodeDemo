module.exports = (sequelize, type) => {
    const Category = sequelize.define('category', {
            category_id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            label: {
                type: type.STRING,
                allowNull: false,

            },
        }, {
            tableName: 'categories'

        },
    );

    const ProductModel = require("./Products");
    Category.prototype.modelIncludes = {
        include: [{
            model: ProductModel,

        }]
    };

    Category.getModelIncludes = function () {
        return Category.modelIncludes;
    };

    Category.associate = function (models, asscoationTab) {
        // associations can be defined here
        Category.belongsToMany(models, {
            through: asscoationTab, unique: false, as: 'products'
        });
    };

    return Category;
};
