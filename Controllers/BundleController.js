
const BaseApiController = require('./BaseApiController');

class BundleController extends BaseApiController {

    constructor() {
        super('bundle');
        this.baseModel = 'bundle';

    }

}

module.exports = BundleController;
