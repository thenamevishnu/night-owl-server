import mongoose from "mongoose"

const postScema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minPay: {
        type: Number,
        required: true
    },
    maxPay:{
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    tags:{
        type: Array,
        required: true,
        default:[]
    },
    status: {
        type: Boolean,
        default: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        required: true
    }
},{
    timestamps: true
})

export const postDB = mongoose.model("posts", postScema)