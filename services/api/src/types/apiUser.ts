import { type User, type Role, type Permission, Prisma } from "@prisma/client"

const userWithRoles = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
        roles: {
            include: {
                permissions: true,
            },
        },
    },
})

type UserWithRoles = Prisma.UserGetPayload<typeof userWithRoles>

export interface ApiUser extends UserWithRoles {}
