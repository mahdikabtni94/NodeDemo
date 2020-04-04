
const BaseApiController = require('./BaseApiController');

class SiteController extends BaseApiController {

    constructor() {
        super('site');
        this.baseModel = 'site';
        this.primary_key = 'site_id';
    }

}

module.exports = SiteController;
