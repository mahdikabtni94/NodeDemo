
const BaseApiController = require('./BaseApiController');

class ArticleController extends BaseApiController {

    constructor() {
        super('article');
        this.baseModel = 'article';
        this.primary_key = 'article_id';
    }

}

module.exports = ArticleController;
