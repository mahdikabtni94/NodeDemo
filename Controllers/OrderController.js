
const BaseApiController = require('./BaseApiController');
let db = require('../models');
class OrderController extends BaseApiController {

    constructor() {
        super('order');
        this.baseModel = 'order';
    }
    AddOrderWithBundles(req,res,next){
        console.log('OrderBody*************',req.body);
        let lines = [];
        let Modelinst = db.order.build(req.body);
        let _this = this;
        Modelinst.save().then(CreatedModel => {
            if(req.body.bundles){
                db.bundle.bulkCreate(req.body.bundles,{returning: true}).then(bundles=>{
                    bundles.forEach(function (bundle,i) {
                        console.log('operationGROUp******',bundle);
                        if(req.body.bundles[i].Operations_group){
                            req.body.bundles[i].Operations_group.forEach(function (operation_group,i) {
                               lines.push(operation_group.line_id);
                               bundle.setLines(lines);
                               db.operation.bulkCreate(operation_group.operations,{returning:true}).then(operations=>{
                                   bundle.setOperations(operations);
                               });

                           })
                        }
                    });
                    CreatedModel.setBundles(bundles);
                })

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

}

module.exports = OrderController;
