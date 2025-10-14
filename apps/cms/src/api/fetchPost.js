export const fetchPost = async (postId) => {
    const apiUrl = import.meta.env.VITE_API_URL
    const url = new URL(`./posts/${postId}`, apiUrl)
    const response = await fetch(url, { mode: "cors" })

    if (!response.ok) {
        throw response
    }

    const post = await response.json()

    return post
}
