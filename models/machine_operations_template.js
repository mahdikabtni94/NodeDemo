'use strict';
module.exports = function (sequelize, DataTypes) {
    const machine_operation_template = sequelize.define('machine_operation_template', {
            machine_operation_template_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            MachineId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
        OperationTemplateId: {
            allowNull: true,
            type: DataTypes.INTEGER
        }


        }, {
            tableName: 'machine_operation_templates'
        }
    );




    return machine_operation_template ;

};

