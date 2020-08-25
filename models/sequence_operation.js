'use strict';
module.exports = function (sequelize, DataTypes) {
    const sequence_operation = sequelize.define('sequence_operation', {
            sequence_operation_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            SequenceId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            OperationId: {
                allowNull: true,
                type: DataTypes.INTEGER
            }


        }, {
            tableName: 'sequence_operation'
        }
    );
    const sequence = require('./sequence');
    const operation = require('./operation');
    sequence_operation.prototype.modelIncludes = {
        'sequence': {
            model: sequence
        },
        'operation': {
            model: operation
        },


    };
    sequence_operation.prototype.getModelIncludes = function () {
        return ['sequence', 'operation'];
    };
    sequence_operation.associate = function (models) {
        // associations can be defined here1
        sequence_operation.belongsTo(models.sequence, {foreignKey: 'SequenceId'});
        sequence_operation.belongsTo(models.operation, {foreignKey: 'OperationId'});


    };

    return sequence_operation;

};

