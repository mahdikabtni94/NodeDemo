
const BaseApiController = require('./BaseApiController');

class PermissionController extends BaseApiController {

    constructor() {
        super('permission');
        this.baseModel = 'permission';
    }

}

module.exports = PermissionController;
