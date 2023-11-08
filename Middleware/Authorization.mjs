import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const Authorization = async (req, res, next) => {
    try{
        const token = req.headers["authorization"]
        const obj = {}
        if(token?.split(" ")[1] == null){
            obj.statusCode = 401
            obj.message = "Authorization Faild!"
        }else{
            const auth = jwt.verify(token?.split(" ")[1],process.env.JWT_KEY)
            const now = Math.floor(new Date().getTime() / 1000)
            if(auth.exp <= now){
                obj.statusCode = 401
                obj.message = "Authorization Faild!"
            }else{
                next()
            }
        }
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

export const adminAuth = async (req, res, next) => {
    try{
        const token = req.headers["authorization"]
        const obj = {}
        if(token?.split(" ")[1] == null){
            obj.status = false
            obj.message = "Authorization Faild!"
        }else{
            const auth = jwt.verify(token?.split(" ")[1],process.env.jwt_key_admin)
            const now = Math.floor(new Date().getTime() / 1000)
            if(auth.exp <= now){
                obj.status = false
                obj.message = "Authorization Faild!"
            }else{
                obj.status = true
                next()
            }
        }
    }catch(err){
        res.json({error:err.message})
    }
}

