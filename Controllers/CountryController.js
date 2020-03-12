const BaseApiController = require('./BaseApiController');


class CountryController extends  BaseApiController {

    constructor(){
        super('country');
        this.baseModel = 'country';
    }
}
module.exports = CountryController;
