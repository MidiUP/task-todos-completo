import Todo from "../models/Todo";
import * as Yup from "yup";

class TodoController {

    async get(req, res) {

        const todos = await Todo.findAll({
            where: { user_id: req.userId }
        })

        return res.json({ todos })
    }

    async getById(req, res) {

        const todo = await Todo.findByPk(req.params.id);

        if (!todo) {
            return res.status(400).json({ err: "Todo não encontrado." })

        }

        if (todo.user_id !== req.userId) {
            return res.status(401).json({ err: "Você não tem autorização de acessar esse todo." })
        }


        return res.json({ todo })

    }

    async create(req, res) {

        const schema = Yup.object().shape({
            description: Yup.string().required(),
            title: Yup.string().required(),
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ err: "Requisição inválida." })
        }

        const { title, description } = req.body;

        console.log(title, description, req.userId);

        const todo = await Todo.create({
            user_id: req.userId,
            title: title,
            description: description
        })

        return res.json({ todo })
    }

    async update(req, res) {

        const schema = Yup.object().shape({
            description: Yup.string(),
            title: Yup.string(),
            completed: Yup.boolean()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ err: "Requisição inválida." })
        }

        const todo = await Todo.findByPk(req.params.id);

        if (!todo) {
            return res.status(400).json({ err: "Todo não encontrado." })
        }

        if (todo.user_id !== req.userId) {
            return res.status(401).json({ err: "Você não tem autorização para acessar esse todo." })
        }

        const { title, description, completed, id } = await todo.update(req.body);


        return res.json({ title, description, completed, id })

    }

    async delete(req, res) {

        const todo = await Todo.findByPk(req.params.id);

        if (!todo) {
            return res.status(400).json({ err: "Todo não encontrado." })
        }

        if (todo.user_id !== req.userId) {
            return res.status(401).json({ err: "Você não tem autorização para acessar esse todo." })
        }

        try {
            await todo.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ err: "Houve algum erro" });
        }
    }

}


export default new TodoController();