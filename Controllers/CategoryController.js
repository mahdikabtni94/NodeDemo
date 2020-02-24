const Model = require('../Models/Index');
const CategoryCLass = require('../Models/Category')
class CategoryController {

    constructor() {
    }

    find(req, res, next) {
        Model.Category.findAll({
            include: Model.Category.getModelIncludes()
        }).then(
            Categories => {
                res.status(200).json({
                    message: 'Categories fetched succesfully!',
                    Categories: Categories
                });
            });
    }

    get(req, res, next) {
        Model.Category.findByPk(req.params.id).then(Category => {
            if (Category) {
                res.status(200).json(Category);
            } else {
                res.status(404).json({message: 'Category Not Found!!'});
            }
        });
    }

    add(req, res, next) {
        const Category = new Model.Category(req.body);
        Category.save().then(createdCategory => {
            if (req.body.products) {
                let promises_to_save_all_products = [];
                req.body.products.forEach(productItem => {
                    const productItemToSave = new Model.Produit(productItem);
                    promises_to_save_all_products.push(productItemToSave.save());
                });

                Promise.all(promises_to_save_all_products).then(function(all_promises_finished) {

                    let promises_cats_products = [];
                    if (all_promises_finished && all_promises_finished.length) {
                        all_promises_finished.forEach(itemProductSaved => {
                            promises_cats_products.push(itemProductSaved.setCategories([createdCategory.category_id]));
                        });
                        Promise.all(promises_cats_products).then(function(all_promises_finished) {
                            createdCategory.getProducts().then(ProductsForCat => {
                                const createdCategoryObj = createdCategory.toJSON();
                                createdCategoryObj.products = ProductsForCat;
                                res.status(201).json({
                                    message: 'Data Added Successfully 2',
                                    data: createdCategoryObj
                                });
                            });
                        });
                    } else {
                        res.status(201).json({
                            message: 'Data Added Successfully 1',
                            data: createdCategory
                        });
                    }
                });
            }

        });
    }

    update(req, res, next) {
        Model.Category.update({
                label: req.body.label
            },
            {
                where: {
                    category_id: req.params.id
                }
            })
            .then(result => {
                console.log(result);
                res.status(200).json({message: 'Update Successful!'});
            })
    }

    delete(req, res, next) {
        Model.Category.destroy({where: {category_id: req.params.id}}).then(result => {
            console.log(result);
            res.status(200).json({message: 'category Deleted!'});
        });
    }
}

module.exports = CategoryController;
