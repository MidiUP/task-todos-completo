'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {

        await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

        await queryInterface.createTable('todos', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                allowNull: false,
                primaryKey: true
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDeleted: 'SET NULL',
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
        });

    },

    down: async(queryInterface, Sequelize) => {

        await queryInterface.dropTable('todos');

    }
};