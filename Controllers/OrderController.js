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
        let operations = [];
        let Modelinst = db.order.build(req.body);
        let sequenceList = [];
        let _this = this;
        Modelinst.save().then(CreatedModel => {
            if (req.body.bundles) {
                db.bundle.bulkCreate(req.body.bundles, {returning: true}).then(bundles => {
                    bundles.forEach(function (bundle, i) {
                        if (req.body.bundles[i].Operations_group) {
                            req.body.bundles[i].Operations_group.forEach(function (operation_group, i) {
                                if (!lines.includes(operation_group.line_id)) {
                                    lines.push(operation_group.line_id);
                                }
                                db.operation.bulkCreate(operation_group.operations, {returning: true}).then(operations => {
                                    bundle.setOperations(operations);
                                    operations.forEach(function (operation, i) {
                                        console.log('operationnnnn', operation);
                                        db.operation_template.findOne({
                                            where: {
                                                op_code: operation.op_code
                                            },
                                            include: [{
                                                model: db.sequence,
                                            }]
                                        }).then(operation_template => {
                                            console.log('operationtempseqqqqqq', operation_template.sequences);
                                            operation_template.sequences.forEach(function (sequence, i) {
                                                db.sequence_operation.create({
                                                    operation_id: operation.operation_id,
                                                    stitchcount: sequence.stitchcount,
                                                    sequence_order: sequence.sequence_order,
                                                    picture: sequence.picture,
                                                    coupe_fil: sequence.coupe_fil,
                                                    back_stitch: sequence.back_stitch,
                                                    back_stitch_positive_tolerence: sequence.back_stitch_positive_tolerence,
                                                    back_stitch_negative_tolerence: sequence.back_stitch_negative_tolerence,
                                                    stitch_count_positive_tolerence: sequence.stitch_count_positive_tolerence,
                                                    stitch_count_negative_tolerence: sequence.stitch_count_negative_tolerence,
                                                    with_subsequence: sequence.with_subsequence,
                                                    description: sequence.description,
                                                    second_back_stitch: sequence.second_back_stitch,

                                                }).then(createdSequence => {
                                                    sequenceList.push(createdSequence.sequence_operation_id);
                                                })

                                            });
                                            operation.setSequence_operations(sequenceList);
                                        });
                                        db.cart_pending_operation.create({
                                            BundleId: bundle.bundle_id,
                                            OperationId: operation.operation_id,
                                            inProgess: 'N',
                                            finished: 0
                                        });
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
                                                console.log("articleeeeee", article);
                                                line.setArticles(article);

                                            });

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
        let LinesFetched = [];
        let operationsFetched = [];
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
                    order_code: req.params.id
                }
            }).then(order => {
            if (!order) {
                return res.status(401).json({
                    message: "Order Doesnt Exist"
                });
            } else {
                console.log('orderaaaaaaaaa', order.ArticleId);
                db.articles_lines.findAll({
                    include: [{
                        model: db.line,
                    }],
                    where: {
                        ArticleId: order.ArticleId,
                    }
                }).then(function (articles_lines) {
                    articles_lines.forEach(line => {
                        db.line.findOne({
                            include: [{
                                model: db.operation,
                            }],
                            where: {
                                line_id: line.line.line_id,
                            }
                        }).then(line => {
                            LinesFetched.push(line);
                        })
                    });
                    db.has_operations.findAll({
                        include: [{
                            model: db.operation_template,
                        }],
                        where: {
                            ArticleId: order.ArticleId,
                        }
                    }).then(function (operations) {
                        operations.forEach(operation => {
                            console.log("operationwawawa", operation);
                            operationsFetched.push(operation.operation_template);
                        });
                        res.json({
                            order: order,
                            lines: LinesFetched,
                            operations: operationsFetched,
                            message: 'success'
                        })
                    });
                });
            }
        })
    }

    UpdateOrder(req, res, next) {
        let operations = [];
        let lines = [];

        db.order.findOne({
            include: [{
                model: db.article,
            }],
            where: {
                order_code: req.params.id,
            }

        }).then(order => {
            db.order.update({
                    quantity: order.quantity + parseInt(req.body.AddedQuantity),
                },
                {
                    where: {
                        order_code: req.params.id,
                    }
                }
            ).then(
                db.article.findOne({
                    where: {
                        article_id: order.ArticleId,
                    }

                }).then(article => {
                        article.setOperation_templates(req.body.operation_templates);
                        article.setLines(req.body.lines);
                    }
                ));
            if (req.body.lineOperations) {
                req.body.lineOperations.forEach(function (lineOperation, i) {
                        db.line.findOne({
                                where: {
                                    line_id: lineOperation.line_id,
                                }
                            }
                        ).then(line => {
                            lines.push(line.line_id);
                        });
                        console.log('lineeeeeOPPPPPPPP', lineOperation);
                        if (req.body.bundles) {
                            req.body.bundles.forEach(function (bundle, i) {
                                console.log('Bundleeeeeeeee', bundle);
                                db.bundle.create({
                                    num_bundle: parseInt(bundle.num_bundle++),
                                    code: bundle.code,
                                    version: bundle.version,
                                    size: bundle.size,
                                    quantity: Math.floor(parseInt(bundle.quantity) / parseInt(bundle.numOfBundles)),
                                    OrderId: order.order_id
                                }).then(CreatedBundle => {
                                    lineOperation.operations.forEach(function (operation, i) {
                                        console.log('operationcarttttttttt', operation);
                                        db.operation.create({
                                                label: operation.label,
                                                op_code: operation.op_code,
                                                description: operation.description,
                                                MachineTypeId: operation.MachineTypeId,
                                                time: operation.time,
                                                accMinPrice: operation.accMinPrice,
                                                BundleId: CreatedBundle.bundle_id,
                                                quantity: CreatedBundle.quantity,
                                            },
                                        ).then(operationCreated => {
                                            operations.push(operationCreated.operation_id);
                                            db.operation_template.findOne({
                                                where: {
                                                    op_code: operationCreated.op_code
                                                },
                                                include: [{
                                                    model: db.sequence,
                                                }]
                                            }).then(operation_template => {
                                                operation_template.sequences.forEach(function (sequence, i) {
                                                    db.sequence_operation.create({
                                                        operation_id: operationCreated.operation_id,
                                                        stitchcount: sequence.stitchcount,
                                                        sequence_order: sequence.sequence_order,
                                                        picture: sequence.picture,
                                                        coupe_fil: sequence.coupe_fil,
                                                        back_stitch: sequence.back_stitch,
                                                        back_stitch_positive_tolerence: sequence.back_stitch_positive_tolerence,
                                                        back_stitch_negative_tolerence: sequence.back_stitch_negative_tolerence,
                                                        stitch_count_positive_tolerence: sequence.stitch_count_positive_tolerence,
                                                        stitch_count_negative_tolerence: sequence.stitch_count_negative_tolerence,
                                                        with_subsequence: sequence.with_subsequence,
                                                        description: sequence.description,
                                                        second_back_stitch: sequence.second_back_stitch,

                                                    }).then(createdSequence => {
                                                    });
                                                });
                                            });
                                            db.cart_pending_operation.create({
                                                BundleId: CreatedBundle.bundle_id,
                                                OperationId: operationCreated.operation_id,
                                                inProgess: 'N',
                                                finished: 0
                                            });
                                            operationCreated.setLines(lines);
                                        });

                                    });
                                    console.log('CreatedBundle', CreatedBundle);
                                    CreatedBundle.setLines(req.body.lines);
                                })
                            })
                        }
                    }
                )
            }
            db.order.findOne({
                include: [{
                    model: db.article,
                }, {
                    model: db.bundle,
                }, {
                    model: db.customer,
                }
                ],
                where: {
                    order_code: req.params.id,
                }
            }).then(UpdatedOrder => {
                db.article.findOne({
                    include: [{
                        model: db.line
                    }, {
                        model: db.operation_template
                    }
                    ],
                    where: {
                        article_id: UpdatedOrder.ArticleId,
                    }

                }).then(UpdatedArticle => {
                    res.json({
                        message: 'success',
                        order: UpdatedOrder,
                        article: UpdatedArticle

                    })
                })

            })
        }).catch(
            err =>
                res.status(500).json(err)
        )
    }
}

module.exports = OrderController;
