
const BaseApiController = require('./BaseApiController');

class MachineController extends BaseApiController {

    constructor() {
        super('machine');
        this.baseModel = 'machine';
        this.primary_key = 'machine_id';
    }
    AddMachine(req,res,next){
        console.log('MachineBody*************',req.body);
        let Modelinst = db.machine.build(req.body);
        let _this = this;
        Modelinst.save().then(CreatedModel => {
            if(req.body.operation_templates){
                CreatedModel.setOperation_templates(req.body.operation_templates);
            }
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
    updateMachine(req, res, next) {
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
                    if(req.body.permissions){
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
}

module.exports = MachineController;
