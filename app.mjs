import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./Router/user.mjs"
import adminRouter from "./Router/admin.mjs"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/", userRouter)
app.use("/admin", adminRouter)

app.listen(process.env.PORT || 3001, () => {
    console.log("Server started : "+ process.env.PORT || 3001)
})