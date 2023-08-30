import jwt from "jsonwebtoken"
import auth from "../../config/auth"

export default (req,res,next) =>{
    const authToken = req.headers.authorization

    if(!authToken){
        return res.status(401).json({error:"Token not provided"})
    }

    const token = authToken.split(' ')[1]

    try {
        jwt.verify(token,auth.secret,function(err,decoded){
            if(err){
                throw new Error()
            }

            req.userId = decoded.id
            req.userName = decoded.name
            return next()
        })
    } catch (error) {
        return res.status(401).json({error:"Token is invalid"})
    }

    // console.log(token);
    // return next()
}