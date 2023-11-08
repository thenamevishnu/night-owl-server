import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const connect = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Database connect successfully");
    }).catch((error) => {
        console.log(error.message)
    })
}