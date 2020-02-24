const Model = require('../Models/Index');
const BaseApiController = require('./BaseApiController');

class ArticleController extends BaseApiController {

    constructor() {
        super();
        this.baseModel = Model.Article;
        this.primary_key = 'article_id';
    }

}

module.exports = ArticleController;
