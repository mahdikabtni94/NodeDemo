module.exports = function (sequelize, DataTypes) {
    const line = sequelize.define('line', {
            line_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            line_label: {
                type: DataTypes.STRING,

            },
            line_description: {
                type: DataTypes.STRING,
            },
            SiteId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'lines'
        }
    );
    const site = require('./site');
    const operation = require('./operation');
    const bundle = require('./bundle');
    const article = require('./articles');
    line.prototype.modelIncludes = {
        'site': {
            model: site
        },
        'operation': {
            model: operation
        },
        'bundle': {
            model: bundle
        },
        'article': {
            model: article
        },


    };
    line.prototype.getModelIncludes = function () {
        return ['site', 'operation', 'bundle','article'];
    };

    line.associate = function (models) {
        // associations can be defined here
        line.belongsTo(models.site, {foreignKey: 'SiteId'});
        line.belongsToMany(models.operation, {through: 'operations_lines', foreignKey: 'LineId'});
        line.belongsToMany(models.bundle, {
            through: 'lines_bundles', foreignKey: 'LineId'
        });
        line.belongsToMany(models.article, {
            through: 'articles_lines', foreignKey: 'LineId'
        });

    };
    return line;


};
