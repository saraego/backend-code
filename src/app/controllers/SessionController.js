import User from "../models/User"
import jwt from "jsonwebtoken"
import auth from "../../config/auth";
import * as Yup from "yup";



class SessionController {
    async store(req, res) {

        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        function userEmailOrPasswordIncorrect() {
            return res.status(401).json("Make sure your password or email are correct")
        }

        if (!await schema.isValid(req.body)) return userEmailOrPasswordIncorrect()

        const { email, password } = req.body

        const user = await User.findOne({where: {email}})

        if (!user) return userEmailOrPasswordIncorrect()

        if (!await user.checkPassword(password)) return userEmailOrPasswordIncorrect()

        return res.status(200).json({ 
            id: user.id, 
            email, 
            admin:user.admin,
            name: user.name, 
            token: jwt.sign({id:user.id,name:user.name},auth.secret,{
                expiresIn:auth.expiresIn
            })
        })
        
    }
}

export default new SessionController()