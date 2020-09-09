'use strict';
module.exports = function (sequelize, DataTypes) {
    const sequence_operation = sequelize.define('sequence_operation', {
            sequence_operation_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            operation_id: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            stitchcount: {
                type: DataTypes.INTEGER,

            },
            sequence_order: {
                type: DataTypes.INTEGER,

            },
            picture: {
                type: DataTypes.STRING,

            },
            coupe_fil: {
                type: DataTypes.INTEGER
            },
            back_stitch: {
                type: DataTypes.INTEGER,

            },
            operation_template_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            parent_sequence: {
                type: DataTypes.INTEGER,
                defaultValue: null
            },
            back_stitch_positive_tolerence: {
                type: DataTypes.INTEGER
            },
            back_stitch_negative_tolerence: {
                type: DataTypes.INTEGER
            },
            stitch_count_positive_tolerence: {
                type: DataTypes.INTEGER
            },
            stitch_count_negative_tolerence: {
                type: DataTypes.INTEGER
            },
            with_subsequence: {
                type: DataTypes.BOOLEAN
            },
            description: {
                type: DataTypes.STRING
            },
            second_back_stitch: {
                type: DataTypes.INTEGER
            },

        }, {
            tableName: 'sequence_operations'
        }
    );

    const operation = require('./operation');
    sequence_operation.prototype.modelIncludes = {

        'operation': {
            model: operation
        },


    };
    sequence_operation.prototype.getModelIncludes = function () {
        return ['operation'];
    };
    sequence_operation.associate = function (models) {
        // associations can be defined here1
        sequence_operation.belongsTo(models.operation, {foreignKey: 'operation_id'});
    };

    return sequence_operation;

};

