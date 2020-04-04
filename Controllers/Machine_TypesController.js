
const BaseApiController = require('./BaseApiController');

class Machine_TypesController extends BaseApiController {

    constructor() {
        super('machine_type');
        this.baseModel = 'machine_type';
        this.primary_key = 'machinetype_id';
    }

}

module.exports = Machine_TypesController;
