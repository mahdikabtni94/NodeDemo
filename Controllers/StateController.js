const BaseApiController = require('./BaseApiController');


class StateController extends  BaseApiController {

    constructor(){
        super('state');
        this.baseModel = 'state';
    }
}
module.exports = StateController;
