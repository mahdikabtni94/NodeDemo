class BaseApiController {

    constructor() {
        this.baseModel = null;
        this.findWhere = null;
        this.findInclude = null;
    }

    getModelPrimaryKey() {
        if (this.baseModel && this.baseModel.primaryKeyAttributes && this.baseModel.primaryKeyAttributes[0]) {
            return this.baseModel.primaryKeyAttributes[0];
        }
        return 'id';
    }

    find(req, res, next) {

        if (!this.baseModel) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.ModelNotDefined'
            })
        }

        this.baseModel.findAll({
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
        if (!this.baseModel) {
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

        this.baseModel.findByPk(req.params.id).then(resData => {
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
        let Modelinst = this.baseModel.build(req.body);
        Modelinst.save().then(CreatedModel => {
            res.status(201).json({
                message: ' Added Successfully',
                article:
                    {
                        Item: CreatedModel,
                        Item_id: CreatedModel[this.getModelPrimaryKey()],
                    }
            });
        });

    }

    update(req, res, next) {
        const where = {};
        where[this.getModelPrimaryKey()] = req.params.id;
        this.baseModel.update(
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

        this.baseModel.destroy({where: where}).then(countDelete => {
            res.status(200).json({message: 'Post Deleted!'});
        });
    }
}

module.exports = BaseApiController;
