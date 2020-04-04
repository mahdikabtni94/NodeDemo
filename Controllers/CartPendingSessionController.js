
const BaseApiController = require('./BaseApiController');

class CartPendingSessionController extends BaseApiController {

    constructor() {
        super('cart_pending_session');
        this.baseModel = 'cart_pending_session';

    }

}

module.exports = CartPendingSessionController;
