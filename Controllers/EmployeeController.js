
const BaseApiController = require('./BaseApiController');

class EmployeeController extends BaseApiController {

    constructor() {
        super('employee');
        this.baseModel = 'employee';
        this.primary_key = 'emp_id';
    }

}

module.exports = EmployeeController;
