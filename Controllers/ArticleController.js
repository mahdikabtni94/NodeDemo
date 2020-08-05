const BaseApiController = require('./BaseApiController');
let db = require('../models');

class ArticleController extends BaseApiController {

    constructor() {
        super('article');
        this.baseModel = 'article';
    }

    AddArticle(req, res, next) {
        console.log('articleBody*************', req.body);
        let Modelinst = db.article.build(req.body);
        let _this = this;
        Modelinst.save().then(CreatedModel => {
            if (req.body.operation_templates) {
                CreatedModel.setOperation_templates(req.body.operation_templates);
            }
            if (req.body.lines) {
                CreatedModel.setLines(req.body.lines);
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

    updateArticle(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;
        let _this = this;
        this.db[this.baseModel].update(
            req.body,
            {where: where})
            .then(UpdatedModel => {
                this.db[this.baseModel].findOne({
                    where: where
                }).then(result1 => {
                    if (req.body.operation_templates) {
                        result1.setOperation_templates(req.body.operation_templates);
                    }
                    let includesQuery = [];
                    if (result1.getModelIncludes && result1.getModelIncludes()) {
                        result1.getModelIncludes().forEach(icludeItem => {
                            if (this.db[icludeItem]) {
                                includesQuery.push({
                                    model: this.db[icludeItem],
                                    required: false,
                                });
                            }
                        })
                    }

                    this.db[this.baseModel].findOne({
                        where: where,
                        include: includesQuery
                    }).then(resFind => {
                        res.json({
                            test: this.baseModel.modelIncludes,
                            message: 'success',
                            data: resFind, status: 1,
                            includesQuery: includesQuery
                        })
                    })

                })

                // res.json(result)
            })
            .catch(err =>
                res.status(500).json(err)
            )
    }

    FindOperationsByArticle(req, res, next) {
        let fetchedarticle;
        let operationsFetched = [];
        db.article.findOne({
            include: [{
                model: db.operation_template,
            }],
            where: {
                article_id: req.params.id
            }
        }).then(article => {
            if (!article) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedarticle = article;

            db.has_operations.findAll({
                include: [{
                    model: db.operation_template,
                }],
                where: {
                    ArticleId: fetchedarticle.article_id,
                }
            }).then(function (operations) {
                console.log("operationssssss", operations);
                operations.forEach(operation => {
                    operationsFetched.push(operation.operation_template);
                });

                res.json({
                    data: operationsFetched,
                    message: 'success'
                })

            })
        }).catch(err => {
            return res.status(401).json({
                message: "Operation Failed"
            });
        });


    }

    FindLinesBYArticle(req, res, next) {
        let fetchedarticle;
        let operationsFetched = [];
        db.article.findOne({
            include: [{
                model: db.line,
            }],
            where: {
                article_id: req.params.id
            }
        }).then(article => {
            if (!article) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedarticle = article;

            db.articles_lines.findAll({
                include: [{
                    model: db.line,
                }],
                where: {
                    ArticleId: fetchedarticle.article_id,
                }
            }).then(function (articles_lines) {
                articles_lines.forEach(operation => {
                    operationsFetched.push(operation.line);
                });

                res.json({
                    data: operationsFetched,
                    message: 'success'
                })

            })
        }).catch(err => {
            return res.status(401).json({
                message: "Operation Failed"
            });
        });
    }

    FindOperationsByLine(res, req, next) {
        let fetchedline;
        let operationsFetched = [];
        db.line.findOne({
            include: [{
                model: db.line,
            }],
            where: {
                line_id: req.params.id
            }
        }).then(line => {
            if (!line) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedline = line;

            db.operations_lines.findAll({
                include: [{
                    model: db.operation,
                }],
                where: {
                    LineId: fetchedline.line_id,
                }
            }).then(function (operations_lines) {
                operations_lines.forEach(operation => {
                    operationsFetched.push(operations_lines.operation);
                });

                res.json({
                    data: operationsFetched,
                    message: 'success'
                })

            })
        }).catch(err => {
            return res.status(401).json({
                message: "Operation Failed"
            });
        });

    }

    /* FindLinesAndOperationsByArticle(req, res, next) {
         let fetchedarticle;
         let linesFetched = [];
         let OperationsFetched = [];

         db.article.findOne({
             include: [{
                 model: db.line,
             },
             ],
             where: {
                 article_id: req.params.id
             }
         }).then(article => {
             if (!article) {
                 return res.status(401).json({
                     message: "Article not found"
                 });
             }
             fetchedarticle = article;
             db.articles_lines.findAll({
                 include: [{
                     model: db.line,
                 }],
                 where: {
                     ArticleId: fetchedarticle.article_id,
                 }
             })
         }).then(function (lines) {
             lines.forEach(line => {
                 linesFetched.push(line.line);
             });
         });
         db.article.findOne({
             include: [{
                 model: db.operation_template,
             }],
             where: {
                 article_id: req.params.id
             }
         }).then(article => {
             if (!article) {
                 return res.status(401).json({
                     message: "Auth failed"
                 });
             }
             fetchedarticle = article;

             db.has_operations.findAll({
                 include: [{
                     model: db.operation_template,
                 }],
                 where: {
                     ArticleId: fetchedarticle.article_id,
                 }
             }).then(function (operations) {
                 console.log("operationssssss", operations);
                 operations.forEach(operation => {
                     OperationsFetched.push(operation.operation_template);
                 });

                 res.json({
                     operations: OperationsFetched,
                     lines: linesFetched,
                     message: 'success'
                 })

             })
         }).catch(err => {
             return res.status(401).json({
                 message: "Operation Failed"
             });
         });

     }*/


}

module.exports = ArticleController;
