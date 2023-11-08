import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    is_google: {
        type: Boolean,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export const userDB = mongoose.model("users", userSchema)