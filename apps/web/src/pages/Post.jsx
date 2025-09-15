import { useLoaderData } from "react-router"
import { getPublicPost } from "../api/posts"
import PostMarkdown from "../components/PostMarkdown"
import Tag from "../components/Tag"
import { Button, Divider, Form, Input, Textarea } from "@heroui/react"
import CommentsSection from "../components/CommentsSection/CommentsSection"

export const postPageLoader = async ({ params }) => {
    const postId = params.postId
    const post = await getPublicPost(postId)

    return {
        postId,
        post,
    }
}

function Post({ post }) {
    const { id, title, body, tags, readingTime, commentsCount } = post

    return (
        <div>
            <h1 className="text-3xl font-medium">{title}</h1>
            <div className="text-foreground/70 my-4 flex flex-col gap-4 text-sm">
                <div className="flex gap-2">
                    <time dateTime="2025-01-01">January 01, 2025</time>
                    <span>•</span>
                    <span>{readingTime}</span>
                </div>
                {tags.length > 0 && (
                    <div className="flex max-w-full flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Tag key={tag.id} tag={tag} />
                        ))}
                    </div>
                )}
            </div>
            <Divider />
            <div className="markdown-body mt-8">
                <PostMarkdown>{body}</PostMarkdown>
            </div>
            <Divider className="mb-8 mt-16" />
            <div>
                <CommentsSection postId={id} commentsCount={commentsCount} />
            </div>
        </div>
    )
}

export default function PostPage() {
    const { postId, post } = useLoaderData()

    return <Post key={postId} post={post} />
}
