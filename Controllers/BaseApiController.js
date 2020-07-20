class BaseApiController {

    constructor(baseModelDao) {
        this.db = require('../models');
        this.baseModel = baseModelDao;
        this.baseModel = null;
    }

    getModelPrimaryKey() {
        if (this.db[this.baseModel] && this.db[this.baseModel].primaryKeyAttributes && this.db[this.baseModel].primaryKeyAttributes[0]) {
            return this.db[this.baseModel].primaryKeyAttributes[0];
        }
        return 'id';
    }

    find(req, res, next) {

        if (!this.db[this.baseModel]) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.ModelNotDefined'
            })
        }

        this.db[this.baseModel].findAll().then(
            result => {
                let includesQuery = [];
                if (result[0].getModelIncludes && result[0].getModelIncludes()) {
                    result[0].getModelIncludes().forEach(includeItem => {
                        if (this.db[includeItem]) {
                            includesQuery.push({
                                model: this.db[includeItem],
                                required: false,
                            });
                        }
                    })

                }

                this.db[this.baseModel].findAll({
                    include: includesQuery
                }).then(resFind => {
                    res.json({
                        message: 'success',
                        data: resFind,
                        status: 1,
                    })
                })
            }).catch(err =>
            res.status(500).json(err)
        )

    }


    get(req, res, next) {
        if (!this.db[this.baseModel]) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.ModelNotDefined'
            })
        }
        if (!req.params.id) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.IdNotIncluded'
            })
        }

        this.db[this.baseModel].findByPk(req.params.id).then(resData => {
            var whereQuery = {};
            whereQuery[this.getModelPrimaryKey()] = resData[this.getModelPrimaryKey()];
            let includesQuery = [];
            if (resData.getModelIncludes && resData.getModelIncludes()) {
                resData.getModelIncludes().forEach(icludeItem => {
                    if (this.db[icludeItem]) {
                        includesQuery.push({
                            model: this.db[icludeItem],
                            required: false,
                        });
                    }
                })
            }
            console.log('resdata***********', resData.getModelIncludes())

            this.db[this.baseModel].findOne({
                where: whereQuery,
                include: includesQuery
            }).then(resFind => {
                res.json({
                    message: 'success',
                    data: resFind,
                    status: 1,

                })
            })
        }).catch(err =>
            res.status(500).json(err)
        )
    }

    add(req, res, next) {
        let Modelinst = this.db[this.baseModel].build(req.body);
        let _this = this;
        Modelinst.save().then(CreatedModel => {
            let whereQuery = {};
            whereQuery[_this.getModelPrimaryKey()] = CreatedModel[_this.getModelPrimaryKey()];
            let includesQuery = (this.baseModel.modelIncludes && this.baseModel.modelIncludes.length) ? (this.baseModel.modelIncludes && this.baseModel.modelIncludes.length) :[];
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
            console.log(_this.baseModel);

            _this.db[_this.baseModel].findOne({
                where: whereQuery,
                include: includesQuery
            }).then(resFind => {
                res.json({
                    test: _this.baseModel.modelIncludes,
                    message: 'success',
                    data: resFind,
                    includesQuery1: includesQuery,
                    whereQuery: whereQuery
                })
            })
        })
            .catch(err =>
                res.status(500).json(err)
            )

    }

    update(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;
        let _this = this;
        this.db[this.baseModel].update(
            req.body,
            {where: where})
            .then(CreatedModel => {
                let includesQuery = [];
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

                _this.db[_this.baseModel].findOne({
                    where: where,
                    include: includesQuery
                }).then(resFind => {
                    res.send({
                        test: _this.baseModel.modelIncludes,
                        message: 'success',
                        data: resFind,
                        includesQuery1: includesQuery,
                        includesQuery: resFind.getModelIncludes(),
                        whereQuery: where
                    })
                })
            })
            .catch(err =>
                res.status(500).json(err)
            )

    }

    delete(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;

        this.db[this.baseModel].destroy({where: where}).then(countDelete => {
            res.status(200).json({message: 'Element Deleted!'});
        });
    }
}

module.exports = BaseApiController;
