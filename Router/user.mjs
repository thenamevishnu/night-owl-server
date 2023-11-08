import express from "express"
import userController from "../Controller/userController.mjs"
import postController from "../Controller/postController.mjs"
import { Authorization } from "../Middleware/Authorization.mjs"

const Route = express.Router()

Route.post("/register", userController.Register)
Route.post("/user-login", userController.userLogin)
Route.post("/google-login", userController.googleLogin)
Route.get("/get-full-jobs/:filters", postController.getFullJobs)
Route.get("/get-latest-jobs", postController.getLatestJobs)

Route.post("/post-job", Authorization, postController.postJob)
Route.get("/get-job-with-id/:id", Authorization, postController.getJobWithId)
Route.get("/get-user-by-id/:id", Authorization, userController.getUserById)




export default Route