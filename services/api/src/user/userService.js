import { prisma } from "../config/prisma.js"

export const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    })

    return user
}

export const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    })

    return user
}

export * as default from "./userService.js"
