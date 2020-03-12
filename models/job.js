module.exports = function (sequelize, DataTypes) {
    const job = sequelize.define('job', {
            job_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            job_label: {
                type: DataTypes.STRING,

            },
            job_description: {
                type: DataTypes.STRING,

            },


        }, {
            tableName: 'jobs'
        }
    );
    const employee = require('./employee');
    job.prototype.modelIncludes = {
        'employee': {
            model: employee
        },


    };
    job.prototype.getModelIncludes = function () {
        return ['employee'];
    };

    job.associate = function (models) {
        // associations can be defined here
        job.hasMany(models.employee, {foreignKey: 'JobId'});

    };
    return job;


};
