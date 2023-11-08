import { userDB } from "../Model/userModel.mjs";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose";
dotenv.config()

const Register = async (req, res) => {
    try{
        const {confirm, ...userData} = req.body.userData
        console.log(userData);
        const obj = {}
        const findUser = await userDB.findOne({username: userData.username})
        if(findUser){
            obj.statusCode = 409
            obj.message = "Username already exist"
        }else{
            const findUser = await userDB.findOne({email: userData.email})
            if(findUser){
                obj.statusCode = 409
                obj.message = "Email already exist"
            }else{
                userData.picture = userData.picture ? userData.picture : process.env.DEFAULT_AVATAR
                userData.password = userData.password ? userData.password : process.env.DEFAULT_PASSWORD
                userData.password = await bcrypt.hash(userData.password, 10)
                const response = await userDB.create(userData)
                if(response._id){
                    obj.statusCode = 200
                    obj.message = "Account created"
                    const token = jwt.sign({sub: response._id}, process.env.JWT_KEY, {expiresIn: "3d"})
                    obj.userData = {
                        id: response._id,
                        name: response.name,
                        username: response.username,
                        picture: response.picture,
                        type: response.type,
                        email: response.email,
                        is_google: response.is_google,
                        token: token
                    }
                }else{
                    obj.statusCode = 500
                    obj.message = "Something went wrong!"
                }
            }
        }
        res.json(obj)
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

const userLogin = async (req, res) => {
    try{
        const {email, password} = req.body.userData
        const obj = {}
        const findUser = await userDB.findOne({email: email})
        if(!findUser){
            obj.statusCode = 404
            obj.message = "User not found"
        }else{
            if(findUser.is_google){
                obj.statusCode = 409
                obj.message = "Email is associated with google login"
            }else{
                const passwordCheck = await bcrypt.compare(password, findUser.password)
                if(!passwordCheck){
                    obj.statusCode = 401
                    obj.message = "Invalid login credentials"
                }else{
                    obj.statusCode = 200
                    obj.message = "Login Success"
                    const token = jwt.sign({sub: findUser._id}, process.env.JWT_KEY, {expiresIn: "3d"})
                    obj.userData = {
                        id: findUser._id,
                        name: findUser.name,
                        username: findUser.username,
                        picture: findUser.picture,
                        type: findUser.type,
                        email: findUser.email,
                        is_google: findUser.is_google,
                        token: token
                    }
                }
            }
        }
        res.json(obj)
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

const googleLogin = async (req, res) => {
    try{
        let {email, password} = req.body.userData
        if(!password){
            password = process.env.DEFAULT_PASSWORD
        }
        const obj = {}
        const findUser = await userDB.findOne({email: email})
        if(!findUser){
            obj.statusCode = 404
            obj.message = "User not found"
        }else{
            if(!findUser.is_google){
                obj.statusCode = 409
                obj.message = "Email is not associated with google login"
            }else{
                const passwordCheck = await bcrypt.compare(password, findUser.password)
                if(!passwordCheck){
                    obj.statusCode = 404
                    obj.message = "User not found"
                }else{
                    obj.statusCode = 200
                    obj.message = "Login Success"
                    const token = jwt.sign({sub: findUser._id}, process.env.JWT_KEY, {expiresIn: "3d"})
                    obj.userData = {
                        id: findUser._id,
                        name: findUser.name,
                        username: findUser.username,
                        picture: findUser.picture,
                        type: findUser.type,
                        email: findUser.email,
                        is_google: findUser.is_google,
                        token: token
                    }
                }
            }
        }
        res.json(obj)
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

const getUserById = async (req, res) => {
    try{
        const user = await userDB.findOne({_id: new mongoose.Types.ObjectId(req.params.id)})
        const obj = {}
        if(!user._id){
            obj.statusCode = 404
            obj.message = "User not found"
        }else{
            obj.statusCode = 200
            obj.message = user
        }
        res.json(obj)
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

export default {
    Register, userLogin, googleLogin, getUserById
}