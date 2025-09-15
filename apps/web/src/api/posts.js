import placeholderBodyUrl from "../assets/markdown_placeholder.txt"

export const getPublicPosts = async ({ page, pageSize }) => {
    const searchParams = new URLSearchParams()
    searchParams.set("_page", page)
    searchParams.set("_limit", pageSize)
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?${searchParams}`,
        { mode: "cors" }
    )

    if (!response.ok) {
        throw response
    }
    let posts = await response.json()

    posts = posts.map((post) => {
        return { ...post, readingTime: "3 min read" }
    })

    return {
        count: 100,
        results: posts,
    }
}

export const getPublicPost = async (postId) => {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        { mode: "cors" }
    )

    if (!response.ok) {
        throw response
    }

    const placeholderBodyFetch = await fetch(placeholderBodyUrl)
    const placeholderBody = await placeholderBodyFetch.text()

    const post = await response.json()

    return {
        ...post,
        body: placeholderBody,
        readingTime: "3 min read",
        tags: [
            {
                id: 1,
                name: "JavaScript",
                slug: "js",
            },
        ],
        commentsCount: 5,
    }
}
