
const BaseApiController = require('./BaseApiController');

class OrderController extends BaseApiController {

    constructor() {
        super('order');
        this.baseModel = 'order';
    }

}

module.exports = OrderController;
