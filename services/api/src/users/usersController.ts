import * as postsService from "../posts/postsService.js"
import * as usersService from "./usersService.js"
import createHttpError from "http-errors"
import type { Request, Response, NextFunction } from "express"
import type { ApiUser } from "../types/apiUser.js"

export const getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new createHttpError.Unauthorized()
        }

        // Omit password
        const { password, ...userDetails } = req.user as ApiUser

        // Map roles to omit Permissions details
        let userRoles: { id: number; name: string }[] = []
        if (userDetails.roles) {
            userRoles = userDetails.roles.map((role) => ({
                id: role.id,
                name: role.name,
            }))
        }
        const userDetailsToSend = {
            ...userDetails,
            roles: userRoles,
        }

        return res.status(200).json(userDetailsToSend)
    } catch (error) {
        next(error)
    }
}

export const getCurrentUserPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new createHttpError.Unauthorized()
        }

        const { q, page, pageSize, sortBy, tags } = req.query
        const { id: userId } = req.user as ApiUser

        const { posts, count } = await postsService.getPosts({
            q,
            pageSize,
            page,
            tags,
            sortBy,
            publishedOnly: false,
            authorId: userId,
            includeBody: false,
        })

        const responseJson = {
            metadata: {
                count: count,
            },
            results: posts,
        }

        return res.status(200).json(responseJson)
    } catch (error) {
        next(error)
    }
}

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password, name, role } = req.body
        const newUser = await usersService.createUser({
            email,
            name,
            password,
            roleName: role,
        })

        const { password: hashedPassword, ...userDetails } = newUser

        return res.status(201).json(userDetails)
    } catch (error) {
        next(error)
    }
}
