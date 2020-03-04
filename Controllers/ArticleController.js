
const BaseApiController = require('./BaseApiController');

class ArticleController extends BaseApiController {

    constructor() {
        super('articles');
        this.baseModel = 'articles';
        this.primary_key = 'article_id';
    }

}

module.exports = ArticleController;
