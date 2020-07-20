'use strict';
module.exports = function (sequelize, DataTypes) {
    const lines_bundles = sequelize.define('lines_bundles', {
            lines_bundles_id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,

            },

            BundleId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            LineId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },

        }, {
            tableName: 'lines_bundles'
        }
    );
    const line = require('./line');
    const bundle = require('./bundle');
    lines_bundles.prototype.modelIncludes = {
        'line': {
            model: line
        },
        'bundle': {
            model: bundle
        },


    };
    lines_bundles.prototype.getModelIncludes = function () {
        return ['line', 'bundle'];
    };
    lines_bundles.associate = function (models) {
        // associations can be defined here1
        lines_bundles.belongsTo(models.line, {foreignKey: 'LineId'});
        lines_bundles.belongsTo(models.bundle, {foreignKey: 'BundleId'});


    };


    return lines_bundles;

};

