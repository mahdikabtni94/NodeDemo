class BaseApiController {

    constructor(baseModelDao) {
        this.db = require('../models');
        this.baseModel = baseModelDao;
        this.findWhere = null;
        this.findInclude = null;
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

        this.db[this.baseModel].findAll({
            where: this.findWhere,
            include: this.findInclude,
        }).then(
            resData => {
                res.status(200).json({
                    message: 'Global.GetDataWithSuccess',
                    data: resData,
                });
            });
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
            if (resData) {
                return res.status(200).json({
                    message: 'Global.GetDataWithSuccess',
                    data: resData
                });
            } else {
                return res.status(500).send({
                    status: false,
                    message: 'System.Error.DataNotFounded'
                })
            }
        });
    }

    add(req, res, next) {
        let Modelinst = this.db[this.baseModel].build(req.body);
        Modelinst.save().then(CreatedModel => {
            let whereQuery = {};
            whereQuery[this.getModelPrimaryKey()] = CreatedModel[this.getModelPrimaryKey()];
            let includesQuery = [];
            if (CreatedModel.getModelIncludes && CreatedModel.getModelIncludes()) {
                CreatedModel.getModelIncludes().forEach(icludeItem => {
                    if (this.db[icludeItem]) {
                        includesQuery.push({
                            model: this.db[icludeItem],
                            required: false,
                        });
                    }
                })
            }
            this.db[this.baseModel].find({
                where: whereQuery,
                include: includesQuery
            }).then(resFind => {
                res.json({
                    test: this.baseModel.modelIncludes,
                    message: 'success',
                    data: resFind,
                    includesQuery: includesQuery
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
        this.db[this.baseModel].update(
            req.body,
            {where: where})
            .then(result => {
                console.log(result);
                res.status(200).json({message: 'Update Successful!'});
            })

    }

    delete(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;

        this.db[this.baseModel].destroy({where: where}).then(countDelete => {
            res.status(200).json({message: 'Post Deleted!'});
        });
    }
}

module.exports = BaseApiController;
