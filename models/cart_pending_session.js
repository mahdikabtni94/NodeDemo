'use strict';
module.exports = function (sequelize, DataTypes) {
    const cart_pending_session = sequelize.define('cart_pending_session', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            CartPendingOperationId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            UserSessionId: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            time: {
                allowNull: true,
                type: DataTypes.INTEGER
            },
            quantity: {
                type: DataTypes.INTEGER
            },

            start_time: {
                type: DataTypes.DATE
            },
            end_time: {
                type: DataTypes.DATE
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type: DataTypes.DATE
            },
            active: {
                type: DataTypes.STRING,
                defaultValue: 'Y'
            },
            in_progress: {
                type: DataTypes.STRING,
                defaultValue: 'N'

            },
            reparation: {
                type: DataTypes.INTEGER
            },


        }, {
            tableName: 'cart_pending_sessions '
        }
    );

    const cart_pending_operation = require('./cart_pending_operation');
    const usersession = require('./usersession');

    cart_pending_session.prototype.modelIncludes = {

        'cart_pending_operation': {
            model: cart_pending_operation
        },
        'usersession': {
            model: usersession
        }


    };
    cart_pending_session.prototype.getModelIncludes = function () {
        return ['cart_pending_operation', 'usersession'];
    };
    cart_pending_session.associate = function (models) {
        // associations can be defined here
        cart_pending_session.belongsTo(models.cart_pending_operation, {foreignKey: 'CartPendingOperationId'});
        cart_pending_session.belongsTo(models.usersession, {foreignKey: 'UserSessionId'});


    };
    return cart_pending_session;

};

