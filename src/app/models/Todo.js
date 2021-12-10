import Sequelize, { Model } from "sequelize";

class Todo extends Model {
    static init(sequelize) {
        super.init({
            description: Sequelize.STRING,
            title: Sequelize.STRING,
            completed: Sequelize.BOOLEAN

        }, {
            sequelize
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
}

export default Todo;