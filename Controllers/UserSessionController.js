
const BaseApiController = require('./BaseApiController');

class UserSessionController extends BaseApiController {

    constructor() {
        super('usersession');
        this.baseModel = 'usersession';
    }

}

module.exports = UserSessionController;
