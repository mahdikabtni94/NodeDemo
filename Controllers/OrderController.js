const BaseApiController = require('./BaseApiController');
let db = require('../models');

class OrderController extends BaseApiController {

    constructor() {
        super('order');
        this.baseModel = 'order';
    }

    AddOrderWithBundles(req, res, next) {
        console.log('OrderBody*************', req.body);
        let lines = [];
        let Modelinst = db.order.build(req.body);
        let _this = this;
        Modelinst.save().then(CreatedModel => {
            if (req.body.bundles) {
                db.bundle.bulkCreate(req.body.bundles, {returning: true}).then(bundles => {
                    bundles.forEach(function (bundle, i) {
                        console.log('operationGROUp******', bundle);
                        console.log('articleIddd******', req.body.ArticleId);

                        if (req.body.bundles[i].Operations_group) {
                            req.body.bundles[i].Operations_group.forEach(function (operation_group, i) {
                                lines.push(operation_group.line_id);
                                db.operation.bulkCreate(operation_group.operations, {returning: true}).then(operations => {
                                    bundle.setOperations(operations);
                                    db.line.findOne({
                                        where: {
                                            line_id: operation_group.line_id
                                        }
                                    }).then(line => {
                                        line.setOperations(operations);
                                        db.article.findOne({
                                            where: {
                                                article_id: req.body.ArticleId
                                            }

                                        }).then(article => {
                                            console.log("articleeeeee",article);
                                            line.setArticles(article);

                                        });

                                    });
                                });


                            });
                        }

                        bundle.setLines(lines);
                        lines = [];


                    });
                    CreatedModel.setBundles(bundles);
                })

            }
            let whereQuery = {};
            whereQuery[_this.getModelPrimaryKey()] = CreatedModel[_this.getModelPrimaryKey()];
            let includesQuery = (this.baseModel.modelIncludes && this.baseModel.modelIncludes.length) ? (this.baseModel.modelIncludes && this.baseModel.modelIncludes.length) : [];
            if (CreatedModel.getModelIncludes && CreatedModel.getModelIncludes()) {
                CreatedModel.getModelIncludes().forEach(icludeItem => {
                    if (_this.db[icludeItem]) {
                        includesQuery.push({
                            model: _this.db[icludeItem],
                            required: false,
                        });
                    }
                })
            }

            _this.db[_this.baseModel].findAll({
                where: whereQuery,
                include: includesQuery
            }).then(resFind => {
                res.json({
                    test: _this.baseModel.modelIncludes,
                    message: 'success',
                    data: resFind,
                    includesQuery: includesQuery,
                    whereQuery: whereQuery
                })
            })
        })
            .catch(err =>
                res.status(500).json(err)
            )

    }

    FindOrder(req, res, next) {
        db.order.findOne(
            {
                include: [
                    {
                        model: db.bundle,
                    },
                    {
                        model: db.article,
                    },
                    {
                        model: db.customer,
                    }

                ],
                where: {
                    order_code: req.body.order_code
                }
            }).then(order => {
            if (!order) {
                return res.status(401).json({
                    message: "Order Doesnt Exist"
                });
            } else {


            }

        })

    }

}

module.exports = OrderController;
