
const BaseApiController = require('./BaseApiController');

class CartPendingOperationController extends BaseApiController {

    constructor() {
        super('cart_pending_operation');
        this.baseModel = 'cart_pending_operation';

    }

}

module.exports = CartPendingOperationController;
