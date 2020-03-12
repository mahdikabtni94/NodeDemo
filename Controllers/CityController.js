const BaseApiController = require('./BaseApiController');


class CityController extends  BaseApiController {

    constructor(){
        super('city');
        this.baseModel = 'city';
    }
}
module.exports = CityController;
