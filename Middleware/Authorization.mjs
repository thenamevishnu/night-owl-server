import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const Authorization = async (req, res, next) => {
    try{
        const token = req.headers["authorization"]
        const obj = {}
        if(token.split(" ")[1] == "null"){
            obj.statusCode = 401
            obj.message = "Please login to access"
            res.json(obj)
        }else{
            const auth = jwt.verify(token?.split(" ")[1],process.env.JWT_KEY)
            const now = Math.floor(new Date().getTime() / 1000)
            if(auth.exp <= now){
                obj.statusCode = 401
                obj.message = "Please login to access"
                res.json(obj)
            }else{
                next()
            }
        }
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}
