import { addToast } from "@heroui/react"
import { deletePost, hidePost, publishPost } from "@repo/client-api/posts"
import { data, redirect } from "react-router"

export const DELETE_INTENT = "delete"
export const PUBLISH_INTENT = "publish"
export const HIDE_INTENT = "hide"

export async function postsAction({ request, params = {} }, accessToken) {
    const { method } = request
    const { postId } = params

    const formData = await request.formData()
    if (method === "POST" && !postId) {
        return await createNewPost({ formData, accessToken })
    }

    if (postId) {
        const intent = formData.get("intent")
        const { postId } = params

        switch (intent) {
            case DELETE_INTENT:
                return await deletePostAction({ accessToken, postId })
            case PUBLISH_INTENT:
                return await publishPostAction({ accessToken, postId })
            case HIDE_INTENT:
                return await hidePostAction({ accessToken, postId })
            default:
                throw data({ message: "Invalid intent" }, 400)
        }
    }

    throw data({ message: "Invalid action" }, 400)
}

async function createNewPost({ formData, accessToken }) {
    try {
        const title = formData.get("title")

        const url = new URL("./posts", import.meta.env.VITE_API_URL)
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ title }),
        })

        if (!response.ok) {
            throw response
        }
        const newPost = await response.json()

        addToast({
            title: "Success",
            description: "Your new article was successfully created.",
            color: "success",
        })
        const { id } = newPost
        return redirect(`/posts/${id}`)
    } catch (error) {
        if (error instanceof Response) {
            addToast({
                title: "Failed to create a new article",
                description: `[${error.status}] - ${error.statusText}`,
                color: "danger",
            })
            return
        }

        console.error(error)
        addToast({
            title: "Failed to create a new article",
            color: "danger",
        })
    }
}

async function deletePostAction({ postId, accessToken }) {
    try {
        await deletePost(postId, accessToken)
        addToast({
            title: "Success",
            description: "Post deleted successfully",
            color: "success",
        })
        return redirect("/")
    } catch (error) {
        addToast({
            title: "Failed to delete post",
            description: `${error.status || 500} : ${error.statusText || error.message}`,
            color: "danger",
        })
    }
}

async function publishPostAction({ postId, accessToken }) {
    try {
        await publishPost(postId, accessToken)
        addToast({
            title: "Success",
            description: "Post published successfully",
            color: "success",
        })
    } catch (error) {
        addToast({
            title: "Failed to publish post",
            description: `${error.status || 500} : ${error.statusText || error.message}`,
            color: "danger",
        })
    }
}

async function hidePostAction({ postId, accessToken }) {
    try {
        await hidePost(postId, accessToken)
        addToast({
            title: "Success",
            description: "Post hidden successfully",
            color: "success",
        })
    } catch (error) {
        addToast({
            title: "Failed to hide post",
            description: `${error.status || 500} : ${error.statusText || error.message}`,
            color: "danger",
        })
    }
}
