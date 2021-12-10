import Sequelize from "sequelize";
import databaseConfig from "../config/database";

import User from '../app/models/User';
import Todo from '../app/models/Todo'

const models = [User, Todo]

class Database {
    constructor() {
        this.init();
    }

    init() {
        //conexão com o banco de dados
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models));
    }
}

export default new Database();