import { Pagination } from "@heroui/react"
import { useLoaderData, useOutletContext } from "react-router"
import PostItem from "../components/PostItem"
import { getPublicPosts } from "../api/posts"
import useTwBreakpoint from "../hooks/useTwBreakpoint"
import SadFaceIcon from "../components/Icons/SadFaceIcon"
import { useEffect } from "react"
import useParamSearchParams from "../hooks/useParamSearchParams"
import SortByButton from "../components/SortByButton"

export const postsLoader = async ({ request }) => {
    const url = new URL(request.url)
    const pageTerm = url.searchParams.get("page")
    const pageSizeTerm = url.searchParams.get("pageSize")
    const sortBy = url.searchParams.get("sortBy")
    const posts = await getPublicPosts({
        page: pageTerm,
        pageSize: pageSizeTerm,
        sortBy,
    })

    return posts
}

export default function Posts() {
    const { metadata, results: posts } = useLoaderData()
    const { count, pageSize } = metadata
    const [currentPageString, setCurrentPage] = useParamSearchParams("page", 1)
    const [leftContent, setLeftContent] = useOutletContext()

    const currentPage = Number(currentPageString)

    useEffect(() => {
        setLeftContent(<SortByButton />)
        return () => setLeftContent(undefined)
    }, [setLeftContent])

    const isMd = useTwBreakpoint("md")

    const totalPages = Math.max(count / Math.max(pageSize, 1), currentPage)

    return (
        <>
            <div>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <PostItem
                            post={post}
                            key={post.id}
                            className="[&+*]:mt-12"
                        />
                    ))
                ) : (
                    <div className="my-4 flex flex-col gap-4">
                        <SadFaceIcon
                            size={48}
                            className="self-center stroke-2"
                        />
                        <p className="text-center text-xl font-medium">
                            No results
                        </p>
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        showControls
                        page={currentPage}
                        onChange={setCurrentPage}
                        total={Math.max(totalPages, currentPage)}
                        siblings={isMd ? 1 : 0}
                    />
                </div>
            )}
        </>
    )
}
