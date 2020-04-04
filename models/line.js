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
    const operation = require('./operation');
    line.prototype.modelIncludes = {
        'site': {
            model: site
        },
        'operation': {
            model: operation
        },


    };
    line.prototype.getModelIncludes = function() {
        return ['site','operation'];
    };

    line.associate = function (models) {
        // associations can be defined here
        line.belongsTo(models.site,{foreignKey: 'SiteId'});
        line.hasMany(models.operation,{foreignKey: 'LineId'});

    };
    return line;


};
