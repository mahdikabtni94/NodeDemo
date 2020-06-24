'use strict';
module.exports = function (sequelize, DataTypes) {
    const sequence = sequelize.define('sequence', {
            sequence_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
                type: DataTypes.INTEGER
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
            tableName: 'sequences '
        }
    );
    const operation_template = require('./operation_template');

    sequence.prototype.modelIncludes = {

        'operation_template': {
            model: operation_template
        },


    };
    sequence.prototype.getModelIncludes = function () {
        return ['operation_template'];
    };
   sequence.associate = function (models) {
        // associations can be defined here
       sequence.belongsTo(models.operation_template, {foreignKey: 'operation_template_id'});



    };
    return sequence;

};

