import { prisma } from "../config/prisma.js"
import { JSDOM } from "jsdom"
import DOMPurify from "dompurify"
import { marked } from "marked"
import { plainTextRenderer } from "../helpers/markedPlainTextRenderer.js"

export const SortByValues = {
    publishedAtAsc: "publishedAt",
    publishedAtDesc: "-publishedAt",
    idAsc: "id",
    idDesc: "-id",
}

export const getPosts = async ({
    q,
    sortBy = SortByValues.publishedAtDesc,
    page = 1,
    pageSize = -1,
    publishedOnly = true,
    authorId = undefined,
    tags = [],
    includeBody = true,
} = {}) => {
    const whereQuery = buildGetPostsQuery(q, publishedOnly, authorId, tags)
    const queryOptions = buildGetPostsQueryOptions(
        whereQuery,
        sortBy,
        page,
        pageSize,
        includeBody
    )

    let [posts, countPosts] = await prisma.$transaction([
        prisma.post.findMany(queryOptions),
        prisma.post.count({
            where: whereQuery,
        }),
    ])

    posts = posts.map((p) => {
        const { _count, ...post } = p
        return {
            ...post,
            commentsCount: _count.comments,
        }
    })

    return { posts, count: countPosts }
}

function buildGetPostsQuery(
    q,
    publishedOnly = true,
    authorId = undefined,
    tags = []
) {
    const tagIds = tags.filter((t) => typeof t === "number")
    const tagSlugs = tags.filter((t) => typeof t === "string")

    const whereQuery = {
        authorId,
    }

    if (q) {
        whereQuery.title = {
            contains: q,
            mode: "insensitive",
        }
    }

    if (publishedOnly) {
        whereQuery.publishedAt = {
            not: null,
        }
    }

    if (tags && tags.length > 0) {
        whereQuery.tags = {
            some: {
                OR: [
                    {
                        id: { in: tagIds },
                    },
                    {
                        slug: { in: tagSlugs },
                    },
                ],
            },
        }
    }

    return whereQuery
}

function buildGetPostsQueryOptions(
    whereQuery,
    sortBy = SortByValues.publishedAtDesc,
    page = 1,
    pageSize = -1,
    includeBody = true
) {
    const queryOptions = {
        where: whereQuery,
        include: {
            _count: {
                select: {
                    comments: true,
                },
            },
            author: {
                select: {
                    id: true,
                    name: true,
                },
            },
            tags: true,
            authorId: false,
        },
        omit: {
            body: !includeBody,
        },
    }

    switch (sortBy) {
        case SortByValues.publishedAtAsc:
            queryOptions.orderBy = {
                publishedAt: "asc",
            }
            break
        case SortByValues.publishedAtDesc:
            queryOptions.orderBy = {
                publishedAt: "desc",
            }
            break
        case SortByValues.idAsc:
            queryOptions.orderBy = {
                id: "asc",
            }
            break
        case SortByValues.idDesc:
            queryOptions.orderBy = {
                id: "desc",
            }
            break
        default:
            break
    }

    page = Math.max(page, 1)
    if (pageSize > 0) {
        queryOptions.skip = (page - 1) * pageSize
        queryOptions.take = pageSize
    }

    return queryOptions
}

export const createPost = async (title, authorId) => {
    const createdPost = await prisma.post.create({
        data: {
            title: title,
            body: `New blog post`,
            authorId: authorId,
        },
    })

    return createdPost
}

export const updatePost = async ({ postId, title, body, tags }) => {
    if (!postId) {
        throw new Error("Invalid post id")
    }

    const queryUpdateData = {
        ...(title && { title }),
        ...(body && { body }),
    }
    const querySelect = {
        id: true,
        title: !!title,
        body: !!body,
    }

    if (body) {
        const { description, readingTime } = parseBody(body)

        queryUpdateData.description = description
        queryUpdateData.readingTime = readingTime

        querySelect.description = true
        querySelect.readingTime = true
    }

    if (tags && tags.length > 0) {
        queryUpdateData.tags = {
            set: tags.map((t) => {
                if (typeof t === "string") {
                    return {
                        slug: t,
                    }
                }
                return {
                    id: t,
                }
            }),
        }
        querySelect.tags = true
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: queryUpdateData,
        select: querySelect,
    })

    return updatedPost
}

function estimateReadingTime(postPlainBody) {
    const bodyWords = postPlainBody.match(/\S+/g)
    // 200 words per minute or 1 minute by default
    return bodyWords ? Math.max(bodyWords.length / 200, 1) : 1
}

function parseBody(body) {
    // https://github.com/ejrbuss/markdown-to-txt/blob/main/src/markdown-to-txt.ts
    const plainBody = marked(body, {
        renderer: plainTextRenderer,
    })
    const window = new JSDOM("").window
    const purify = DOMPurify(window)
    const sanitizedBody = purify.sanitize(plainBody)

    // Get first 50 words from body to use as description
    let description = sanitizedBody
    const descrMatch = sanitizedBody.match(/(^(?:\S+\s*){1,50}).*/)
    if (descrMatch) {
        description = `${descrMatch[1].trim()}...`
    }

    // Reading time estimation
    const readingTime = estimateReadingTime(plainBody)

    return { description, readingTime }
}

export const deletePost = async (postId) => {
    const deletedPost = await prisma.post.delete({
        where: {
            id: postId,
        },
    })

    return deletedPost
}

export const publishPost = async (postId) => {
    const publishedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            publishedAt: new Date(),
        },
    })

    return publishedPost
}

export const hidePost = async (postId) => {
    const publishedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            publishedAt: null,
        },
    })

    return publishedPost
}

export const getPostDetails = async (
    postId,
    { includeComments = false, includeTags = false } = {}
) => {
    const { _count, ...post } = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
            _count: {
                select: {
                    comments: true,
                },
            },
            ...(includeComments && {
                comments: true,
            }),
            ...(includeTags && {
                tags: true,
            }),
        },
    })

    return { ...post, commentsCount: _count.comments }
}

export const userCanViewPost = (post, userId) => {
    if (!post.publishedAt) {
        if (!userId || post.authorId !== userId) {
            return false
        }
    }

    return true
}
