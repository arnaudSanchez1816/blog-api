import { Router } from "express"
import { deleteComment, editComment, getComment } from "./commentsController.js"
import passport from "passport"
import { strategies } from "../config/passport.js"

const router = Router()
router
    .route("/:id")
    .all(passport.authenticate(strategies.jwt, { session: false }))
    .get(getComment)
    .put(editComment)
    .delete(deleteComment)

export default router
