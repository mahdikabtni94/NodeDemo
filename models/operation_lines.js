'use strict';
module.exports = function (sequelize, DataTypes) {
    const operations_lines = sequelize.define('operations_lines', {
            operations_lines_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            LineId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            OperationId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'operations_lines'
        }
    );
    const line = require('./line');
    const operation = require('./operation');
    operations_lines.prototype.modelIncludes = {
        'line': {
            model: line
        },
        'operation': {
            model: operation
        },


    };
    operations_lines.prototype.getModelIncludes = function () {
        return ['line', 'operation'];
    };
    operations_lines.associate = function (models) {
        // associations can be defined here1
        operations_lines.belongsTo(models.line, {foreignKey: 'LineId'});
        operations_lines.belongsTo(models.operation, {foreignKey: 'OperationId'});


    };

    return operations_lines;

};

