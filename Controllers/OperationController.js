
const BaseApiController = require('./BaseApiController');

class OperationController extends BaseApiController {

    constructor() {
        super('operation');
        this.baseModel = 'operation';
    }

}

module.exports = OperationController;
