const Model = require('../Models/Index');

class ProduitController {
    constructor() {

    }

    getproducts(req, res, next) {
        Model.Produit.findAll().then(
            produits => {
                res.status(200).json({
                    message: 'Produits fetched succesfully!',
                    Produits: produits
                });
            });
    }

    getproduct(req, res, next) {

        Model.Produit.findByPk(req.params.id).then(produit => {
            if (produit) {
                res.status(200).json(produit);
            } else {
                res.status(404).json({message: 'Product Not Found!!'});
            }
        })

    }

    Add(req, res, next) {
        const produit = new Model.Produit({
            label: req.body.label,
            description: req.body.description,

        });
        produit.save().then(CreatedProduit => {
            res.status(201).json({
                message: 'Post Added Successfully',
                Product:
                    {
                        Produit: CreatedProduit,
                        Product_id: CreatedProduit.Product_id,

                    }
            });
        });

    }

    UpdateProduct(req, res, next) {

        Model.Produit.update(
            {
                label: req.body.label,
                description: req.body.description,
            },
            {where: {Product_id: req.params.id}})
            .then(result => {
                console.log(result);
                res.status(200).json({message: 'Update Successful!'});
            })

    }

    Delete(req, res, next) {
        Model.Produit.destroy({where: {Product_id: req.params.id}}).then(result => {
            console.log(result);
            res.status(200).json({message: 'Post Deleted!'});

        });

    }


}

module.exports = ProduitController;
