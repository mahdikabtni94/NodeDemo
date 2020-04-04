
const BaseApiController = require('./BaseApiController');

class MachineController extends BaseApiController {

    constructor() {
        super('machine');
        this.baseModel = 'machine';
        this.primary_key = 'machine_id';
    }

}

module.exports = MachineController;
