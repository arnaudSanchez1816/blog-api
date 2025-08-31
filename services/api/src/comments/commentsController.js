import { validateRequest } from "../middlewares/validator.js"
import {
    deleteCommentValidator,
    editCommentValidator,
    getCommentValidator,
} from "./commentsValidators.js"
import commentsService from "./commentsService.js"
import createHttpError from "http-errors"

export const getComment = [
    validateRequest(getCommentValidator),
    async (req, res, next) => {
        try {
            const { id: commentId } = req.params
            const comment = await commentsService.getComment(commentId)
            if (!comment) {
                throw new createHttpError.NotFound()
            }

            return res.json(comment)
        } catch (error) {
            next(error)
        }
    },
]

export const deleteComment = [
    validateRequest(deleteCommentValidator),
    async (req, res, next) => {
        try {
            const { id: commentId } = req.params
            const comment = await commentsService.getComment(commentId)
            if (!comment) {
                throw new createHttpError.NotFound()
            }

            await commentsService.deleteComment(commentId)

            return res.status(204).send()
        } catch (error) {
            next(error)
        }
    },
]

export const editComment = [
    validateRequest(editCommentValidator),
    async (req, res, next) => {
        try {
            const { id: commentId } = req.params
            const { username, body } = req.body

            const comment = await commentsService.getComment(commentId)
            if (!comment) {
                throw new createHttpError.NotFound()
            }

            const updatedComment = await commentsService.updateComment({
                commentId,
                username,
                body,
            })

            return res.json(updatedComment)
        } catch (error) {
            next(error)
        }
    },
]
