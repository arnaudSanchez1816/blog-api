import { Alert, Button } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import Comment from "./Comment"
import CommentSkeleton from "./CommentSkeleton"
import CommentReplyForm from "./CommentReplyForm"

async function fetchComments(
    postId,
    setComments,
    setLoading,
    setError,
    abortSignal
) {
    try {
        setLoading(true)
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
            { mode: "cors" }
        )
        if (!response.ok) {
            throw new Error("Failed to fetch comments")
        }

        const jsonData = await response.json()
        if (abortSignal.aborted) {
            return
        }

        setComments({
            count: jsonData.length,
            results: jsonData,
        })
        setError(undefined)
        console.dir(jsonData)
    } catch (error) {
        if (abortSignal.aborted) {
            return
        }
        setError(error)
        setComments(undefined)
    } finally {
        if (!abortSignal.aborted) {
            setLoading(false)
        }
    }
}

function CommentsSectionWrapper({
    commentsCount,
    children,
    fetchComments,
    postId,
}) {
    return (
        <div id="comments">
            <h2 className="text-2xl font-medium">
                {commentsCount > 0 && <span>{commentsCount} </span>}
                Comments
            </h2>
            <div className="mt-8 flex flex-col gap-12">{children}</div>
            <CommentReplyForm fetchComments={fetchComments} postId={postId} />
        </div>
    )
}

export default function CommentsSection({ postId, commentsCount }) {
    const [triggerFetch, setTriggerFetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)
    const [commentsData, setCommentsData] = useState(undefined)

    useEffect(() => {
        let fetchAbortCt

        if (triggerFetch) {
            fetchAbortCt = new AbortController()
            fetchComments(
                postId,
                setCommentsData,
                setLoading,
                setError,
                fetchAbortCt.signal
            ).then(() => {
                setTriggerFetch(false)
            })
        }

        return () => {
            if (fetchAbortCt) {
                fetchAbortCt.abort()
            }
        }
    }, [triggerFetch, setTriggerFetch, postId])

    const triggerFetchComments = useCallback(() => {
        setTriggerFetch(true)
    }, [setTriggerFetch])

    if (error) {
        return (
            <CommentsSectionWrapper
                commentsCount={commentsCount}
                fetchComments={triggerFetchComments}
                postId={postId}
            >
                <Alert
                    color="danger"
                    title="Something wrong happened when trying to fetch comments"
                />
            </CommentsSectionWrapper>
        )
    }

    if (loading) {
        const skeletons = []
        for (let i = 0; i < commentsCount; ++i) {
            skeletons.push(<CommentSkeleton key={i} />)
        }
        return (
            <CommentsSectionWrapper
                commentsCount={commentsCount}
                fetchComments={triggerFetchComments}
                postId={postId}
            >
                {skeletons}
            </CommentsSectionWrapper>
        )
    }

    if (!commentsData) {
        if (commentsCount <= 0) {
            return (
                <div className="flex items-center justify-center">
                    <p className="text-foreground/70 text-lg font-medium">
                        No comments yet
                    </p>
                </div>
            )
        } else {
            return (
                <CommentsSectionWrapper
                    commentsCount={commentsCount}
                    fetchComments={triggerFetchComments}
                    postId={postId}
                >
                    <div className="mt-8 flex justify-center">
                        <Button
                            color="default"
                            onPress={() => setTriggerFetch(true)}
                            radius="sm"
                        >
                            View Comments
                        </Button>
                    </div>
                </CommentsSectionWrapper>
            )
        }
    }

    const { results } = commentsData
    return (
        <CommentsSectionWrapper
            commentsCount={commentsCount}
            fetchComments={triggerFetchComments}
            postId={postId}
        >
            {results.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </CommentsSectionWrapper>
    )
}
