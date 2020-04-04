
const BaseApiController = require('./BaseApiController');

class LineController extends BaseApiController {

    constructor() {
        super('line');
        this.baseModel = 'line';
        this.primary_key = 'line_id';
    }

}

module.exports = LineController;
