import { Router } from "express"
import {
    createPost,
    getPublishedPosts,
    updatePost,
    deletePost,
    getPost,
    getPostComments,
    createPostComment,
} from "./postsController.js"
import passport from "passport"
import { strategies } from "../config/passport.js"

const router = Router()
const idRouter = Router()

// /posts/:id/comments
idRouter
    .route("/comments")
    .all(
        passport.authenticate(strategies.jwt, {
            session: false,
            failWithError: false,
        })
    )
    .get(getPostComments)
    .post(createPostComment)
// /posts/:id
idRouter
    .route("/")
    .get(
        passport.authenticate(strategies.jwt, {
            session: false,
            failWithError: false,
        }),
        getPost
    )
    .put(passport.authenticate(strategies.jwt, { session: false }), updatePost)
    .delete(
        passport.authenticate(strategies.jwt, { session: false }),
        deletePost
    )

router.use("/:id", idRouter)

// /posts
router
    .route("/")
    .get(getPublishedPosts)
    .post(passport.authenticate(strategies.jwt, { session: false }), createPost)

export default router
