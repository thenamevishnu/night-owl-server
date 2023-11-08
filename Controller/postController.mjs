import mongoose from "mongoose"
import { postDB } from "../Model/postModel.mjs"

const postJob = async (req, res) => {
    try{
        const {postData} = req.body
        const response = await postDB.create(postData)
        const obj = {}
        if(response._id){
            obj.statusCode = 200
            obj.message = "Post Created"
        }else{
            obj.statusCode = 500
            obj.message = "Something went wrong"
        }
        res.json(obj)
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

const getFullJobs = async (req, res) => {
    try{
        const query = JSON.parse(req.params.filters)
        const regexp = new RegExp(`${query.q}`,`i`)
        const obj = {$or:[{title: {$regex: regexp}, description: {$regex: regexp}}], status: true, isCompleted: false}
        const sort = {}
        for(let key in query){
            if(key == "amount"){
                const [min, max] = query.amount.split(" - ")
                if(min){
                    let minPay = min.replace("₹","")
                    minPay = minPay.replace("K","000")
                    minPay = parseInt(minPay)
                    obj.minPay = {$gte: minPay}
                }
                if(max){
                    let maxPay = max.replace("₹","")
                    maxPay = maxPay.replace("K","000")
                    maxPay = parseInt(maxPay)
                    obj.maxPay = {$lte: maxPay}
                }
                if(min && !max){
                    obj.maxPay = 10000000
                }
            }else if(query[key] && key != "sort" && key != "q" && key!= "page"){
                obj[key] = query[key]
            }
            if(key == "sort"){
                if(query[key] == "Latest"){
                    sort.createdAt = -1
                }else if(query[key] == "Amount Low-High"){
                    sort.minPay = 1
                }else if((query[key] == "Amount High-Low")){
                    sort.minPay = -1
                }
            }
        }
        const skip = query.page * 3 - 3
        const response = await postDB.find(obj).sort(sort).skip(skip).limit(3)
        const total = await postDB.find(obj)
        if(Array.isArray(response)){
            res.json({statusCode: 200, message: response, pages: Math.ceil(total.length/3)})
        }else{
            res.json({statusCode: 500, message: "Something went wrong"})
        }
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

const getLatestJobs = async (req, res) => {
    try{
        const response = await postDB.find().sort({createdAt: -1}).limit(4)
        const obj = {}
        if(Array.isArray(response)){
            obj.statusCode = 200
            obj.message = response
        }else{
            obj.statusCode = 500
            obj.message = "Something went wrong"
        }
        res.json(obj)
    }catch(err){
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

const getJobWithId = async (req, res) => {
    try{
        const response = await postDB.findOne({_id: new mongoose.Types.ObjectId(req.params.id)})
        const obj = {}
        if(response._id){
            obj.statusCode = 200
            obj.message = response
        }else{
            obj.statusCode = 500
            obj.message = "Something went wrong"
        }
        res.json(obj)
    }catch(err){
        console.log(err);
        res.json({statusCode: 500, message: "Internal Server Error"})
    }
}

export default {
    postJob, getFullJobs, getLatestJobs, getJobWithId
}