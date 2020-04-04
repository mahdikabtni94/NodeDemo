
const BaseApiController = require('./BaseApiController');
let db = require('../models');

class ProfileController extends BaseApiController {

    constructor() {
        super('profile');
        this.baseModel = 'profile';
    }
AddProfile(req,res,next){
    console.log('profileBody*************',req.body);
    let Modelinst = db.profile.build(req.body);
    let _this = this;
    Modelinst.save().then(CreatedModel => {
        if(req.body.permissions){
            CreatedModel.setPermissions(req.body.permissions);
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

module.exports = ProfileController;
