import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConfig from "../../config/auth"

export default async(req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ err: "Token não existe." })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret)
        req.userId = decoded.id;
        return next();
    } catch (err) {
        res.status(401).json({ err: "Token inválido." })
    }

}