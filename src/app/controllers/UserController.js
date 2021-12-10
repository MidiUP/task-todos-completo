import User from "../models/User";
import * as Yup from "yup";

class UserController {

    async get(req, res) {

        const users = await User.findAll();

        return res.json({ users })
    }

    async getById(req, res) {

        const user = await User.findByPk(req.params.id);

        if (user) {
            return res.json({ user })
        }

        return res.status(400).json({ err: "Usuário não encontrado." })

    }

    async create(req, res) {

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(6)
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ err: "Requisição inválida." })
        }

        const { email } = req.body;

        const checkEmail = await User.findOne({
            where: { email }
        });

        if (checkEmail) {
            return res.status(400).json({ err: "Email já cadastrado!" })
        }

        const user = await User.create(req.body);
        return res.json(user)
    }

    async update(req, res) {

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field)
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ err: "Requisição inválida." })
        }

        const { email, oldPassword, password } = req.body;

        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(400).json({ err: "Usuário não encontrado." })
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({
                where: { email }
            })

            if (emailExists) {
                return res.status(400).json({ err: "Email já cadastrado" })
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ err: "Senha inválida." })
        }

        if (password && !oldPassword) {
            return res.status(400).json({ err: "Requisição inválida." })
        }

        const userUpdated = await user.update(req.body);



        return res.json({ userUpdated })
    }

    async delete(req, res) {

        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(400).json({ err: "Usuário não encontrado." })
        }

        try {
            await user.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ err: "Houve algum erro interno do servidor." })
        }

    }


}
export default new UserController();