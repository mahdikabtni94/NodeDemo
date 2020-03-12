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
              line_description :{
                type : DataTypes.STRING,
              },
               SiteId : {
                   allowNull : true,
                   type : DataTypes.INTEGER
               }



        }, {
            tableName: 'lines'
        }
    );
    const site = require('./site');
    line.prototype.modelIncludes = {
        'site': {
            model: site
        },


    };
    line.prototype.getModelIncludes = function() {
        return ['site'];
    };

    line.associate = function (models) {
        // associations can be defined here
        line.belongsTo(models.site,{foreignKey: 'SiteId'});

    };
    return line;


};
