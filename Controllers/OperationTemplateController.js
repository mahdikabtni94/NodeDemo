
const BaseApiController = require('./BaseApiController');

class OperationTemplateController extends BaseApiController {

    constructor() {
        super('operation_template');
        this.baseModel = 'operation_template';
    }

}

module.exports = OperationTemplateController;
