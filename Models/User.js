module.exports = (sequelize, type) => {
    return sequelize.define('user', {
            user_id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: type.STRING,
                allowNull: false,
                unique: true,

            },
            password: {
                type: type.STRING,
                allowNull: false,
                unique: true,

            },
            Name: {
                type: type.STRING
            },
            Username: {
                type: type.STRING,
                allowNull: false,
                unique : true,


            },
            Phone: {
                type: type.STRING,
                allowNull:true

            },
            Address: {
                type: type.STRING,


            },
            City: {
                type: type.STRING,
            },
            Profile: {
                type: type.STRING,

            },
            Activated: {
                type: type.BOOLEAN,
                defaultValue: '0'
            }
        },
        {
            tableName: 'Users'
        })

};
