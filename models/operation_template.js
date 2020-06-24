'use strict';
module.exports = function (sequelize, DataTypes) {
    const operation_template = sequelize.define('operation_template', {
            operation_template_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            label: {
                type: DataTypes.STRING,

            },
            op_code: {
                type: DataTypes.STRING,

            },
            description: {
                type: DataTypes.STRING,

            },
            MachineTypeId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            time: {
                type: DataTypes.STRING,

            },
            accMinPrice: {
                type: DataTypes.STRING
            },
            with_subsequence: {
                type: DataTypes.BOOLEAN
            },


        }, {
            tableName: 'operation_templates '
        }
    );
    const machinetype = require('./machine_type');
    const machine = require('./machine');
    const sequence = require('./sequence');
    const article = require('./articles');
    operation_template.prototype.modelIncludes = {

        'machine_type': {
            model: machinetype
        },
        'machine': {
            model: machine
        },
        'sequence': {
            model: sequence
        },
        'article':{
            model: article
        }


    };
    operation_template.prototype.getModelIncludes = function () {
        return ['machine_type', 'machine','sequence','article'];
    };
    operation_template.associate = function (models) {
        // associations can be defined here
        operation_template.belongsToMany(models.machine, {
            through: 'machine_operation_template', foreignKey: 'OperationTemplateId'
        });
        operation_template.belongsTo(models.machine_type, {foreignKey: 'MachineTypeId'});
        operation_template.hasMany(models.sequence,{foreignKey: 'operation_template_id'});
        operation_template.belongsToMany(models.article, {
            through: 'has_operations', foreignKey :'OperationId'});


    };
    return operation_template;

};

