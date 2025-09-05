import { globalIgnores } from "eslint/config"
import { config } from "@repo/eslint-config/react"
import pluginRouter from "@tanstack/eslint-plugin-router"

export default [
    ...config,
    ...pluginRouter.configs["flat/recommended"],
    globalIgnores(["**/routeTree.gen.ts"]),
]
