const BaseApiController = require('./BaseApiController');


class CustomerController extends  BaseApiController {

    constructor(){
        super('customer');
        this.baseModel = 'customer';
    }
}
module.exports = CustomerController;
