import jwt from "jsonwebtoken";
import * as Yup from "yup";

import User from "../models/User";
import authConfig from "../../config/auth";


class SessionController {

    async login(req, res) {

        const schema = Yup.object().shape({
            email: Yup.string().required().email(),
            password: Yup.string().required().min(6)
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ err: "Requisição inválida." })
        }

        const { email, password } = req.body;


        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ err: "email não cadastrado." })
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ err: "senha incorreta." })
        }

        const { id, name } = user;


        return res.json({
            user: {
                id,
                name
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            })
        })
    }


}
export default new SessionController();