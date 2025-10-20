import { addToast, Divider } from "@heroui/react"
import {
    deletePost,
    fetchPost,
    hidePost,
    publishPost,
} from "@repo/client-api/posts"
import CommentsSection from "@repo/ui/components/CommentsSection/CommentsSection"
import PostHeader from "@repo/ui/components/PostHeader"
import PostMarkdown from "@repo/ui/components/PostMarkdown"
import { postSchema } from "@repo/zod-schemas"
import { useEffect } from "react"
import { data, redirect, useLoaderData, useOutletContext } from "react-router"
import PostAdminControls from "../components/PostAdminControls/PostAdminControls"

export async function postLoader({ params }, accessToken) {
    const postIdSchema = postSchema.pick({ id: true })
    const { id } = await postIdSchema.parseAsync({ id: params.postId })
    const post = await fetchPost(id, accessToken)

    return post
}

export const DELETE_INTENT = "delete"
export const PUBLISH_INTENT = "publish"
export const HIDE_INTENT = "hide"

export async function postAction({ request, params }, accessToken) {
    const formData = await request.formData()
    const intent = formData.get("intent")
    const { postId } = params

    await new Promise((res) => setTimeout(res, 2000))

    switch (intent) {
        case DELETE_INTENT:
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
            break
        case PUBLISH_INTENT:
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
            break
        case HIDE_INTENT:
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
            break
        default:
            throw data({ message: "Invalid intent" }, 400)
    }
}

export default function Post() {
    const post = useLoaderData()

    const { id, body, commentsCount } = post

    const [leftContent, setLeftContent] = useOutletContext()
    useEffect(() => {
        setLeftContent(<PostAdminControls post={post} />)
        return () => setLeftContent(undefined)
    }, [setLeftContent, post])

    return (
        <article>
            <PostHeader post={post} />
            <Divider />
            <div className="mt-8">
                <PostMarkdown>{body}</PostMarkdown>
            </div>
            <Divider className="mb-8 mt-16" />
            <div>
                <CommentsSection postId={id} commentsCount={commentsCount} />
            </div>
        </article>
    )
}
