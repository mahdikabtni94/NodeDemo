
const BaseApiController = require('./BaseApiController');

class JobController extends BaseApiController {

    constructor() {
        super('job');
        this.baseModel = 'job';
        this.primary_key = 'job_id';
    }

}

module.exports = JobController;

