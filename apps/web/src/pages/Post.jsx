import { useLoaderData } from "react-router"
import { getPublicPost } from "../api/posts"
import PostMarkdown from "../components/PostMarkdown"

export const loader = async ({ params }) => {
    const postId = params.postId
    const post = await getPublicPost(postId)

    return {
        postId,
        post,
    }
}

export default function Post() {
    const { postId, post } = useLoaderData()

    const { title, body } = post

    return (
        <div>
            <h1 className="text-3xl font-medium">{title}</h1>
            <div className="markdown-body mt-8">
                <PostMarkdown>{body}</PostMarkdown>
            </div>
        </div>
    )
}
