import User from "../models/User"
import * as Yup from "yup";
import { v4 } from "uuid"


class UserController {
    async store(req, res) {

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean()
        })

        // if (!await schema.isValid(req.body)) {
        //     return res.status(400).json({ error: "Make sure your data is correct" })
        // }

        try {
            await schema.validateSync(req.body, {abortEarly:false})
        } catch (error) {
           return res.status(400).json(error.errors)
        }

        const { name, email, password, admin } = req.body

        const userExist = await User.findOne({
            where:{email}
        })
        
        if(userExist){
            return res.status(409).json({error:"user already exist"})
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin
        })


        return res.status(201).json({ id: user.id, name, email, admin })
    }
}

export default new UserController()