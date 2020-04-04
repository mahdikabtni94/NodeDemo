
const BaseApiController = require('./BaseApiController');

class BoxController extends BaseApiController {

    constructor() {
        super('box');
        this.baseModel = 'box';
        this.primary_key = 'box_id';
    }

}

module.exports = BoxController;
