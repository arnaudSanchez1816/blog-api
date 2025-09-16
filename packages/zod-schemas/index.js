import { z } from "zod"

export const commentSchema = z.object({
    id: z.coerce.number().int().min(1),
    username: z.string().trim(),
    body: z.string().trim(),
})

export const postSchema = z.object({
    id: z.coerce.number().int().min(1),
    title: z.string().trim().min(1),
    body: z.string(),
})
