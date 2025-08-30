import { Router } from "express"
import { signup } from "./signupController.js"

const router = Router()

router.post("/", signup)

export default router
