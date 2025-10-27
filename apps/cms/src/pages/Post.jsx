import { Divider } from "@heroui/react"
import { fetchPost } from "@repo/client-api/posts"
import CommentsSection, {
    commentsSectionId,
} from "@repo/ui/components/CommentsSection/CommentsSection"
import PostHeader from "@repo/ui/components/PostHeader"
import PostMarkdown from "@repo/ui/components/PostMarkdown"
import { postSchema } from "@repo/zod-schemas"
import { useEffect } from "react"
import { useLoaderData, useLocation, useOutletContext } from "react-router"
import PostAdminControls from "../components/PostAdminControls/PostAdminControls"
import CmsComment from "../components/CmsComment"

export async function postLoader({ params }, accessToken) {
    const postIdSchema = postSchema.pick({ id: true })
    const { id } = await postIdSchema.parseAsync({ id: params.postId })
    const post = await fetchPost(id, accessToken)

    return post
}

export default function Post() {
    const post = useLoaderData()

    const { id, body, commentsCount } = post

    const [leftContent, setLeftContent] = useOutletContext()
    useEffect(() => {
        setLeftContent(<PostAdminControls post={post} />)
        return () => setLeftContent(undefined)
    }, [setLeftContent, post])

    let commentsAutoFetched = false
    const { hash } = useLocation()

    if (hash && hash === `#${commentsSectionId}`) {
        commentsAutoFetched = true
    }

    return (
        <article>
            <PostHeader post={post} />
            <Divider />
            <div className="mt-8">
                <PostMarkdown>{body}</PostMarkdown>
            </div>
            <Divider className="mb-8 mt-16" />
            <div>
                <CommentsSection
                    postId={id}
                    autoFetch={commentsAutoFetched}
                    commentsCount={commentsCount}
                    commentRender={(comment, { refreshComments }) => (
                        <CmsComment
                            key={comment.id}
                            comment={comment}
                            refreshComments={refreshComments}
                        />
                    )}
                />
            </div>
        </article>
    )
}
