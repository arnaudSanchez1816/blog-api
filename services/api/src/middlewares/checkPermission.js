import { PermissionType } from "@prisma/client"
import createHttpError from "http-errors"

/**
 *
 * @param {PermissionType} permission
 * @returns
 */
export const checkPermission = (permission) => (req, res, next) => {
    try {
        const user = req.user
        const userRoles = user.roles
        const rolesWithPermissions = userRoles.filter((r) =>
            r.permissions.includes(permission)
        )

        if (!rolesWithPermissions || rolesWithPermissions.length === 0) {
            throw new createHttpError.Forbidden()
        }

        next()
    } catch (error) {
        next(error)
    }
}
