module.exports = function (sequelize, DataTypes){
    var user = sequelize.define('user', {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,

            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,


            },
            Name: {
                type: DataTypes.STRING
            },
            Username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique : true,


            },
            Phone: {
                type: DataTypes.STRING,
                allowNull:true

            },
            Address: {
                type: DataTypes.STRING,


            },
            City: {
                type: DataTypes.STRING,
            },
            Profile: {
                type: DataTypes.STRING,

            },
            Activated: {
                type: DataTypes.BOOLEAN,
                defaultValue: '0'
            }
        },
        {
            tableName: 'Users'
        });
return user
};
