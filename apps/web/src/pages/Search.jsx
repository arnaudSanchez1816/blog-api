import { useLoaderData, useNavigation } from "react-router"
import { getPublicPosts } from "../api/posts"
import PostItem from "../components/PostItem"
import SadFaceIcon from "../components/Icons/SadFaceIcon"
import { Pagination, Spinner } from "@heroui/react"
import useTwBreakpoint from "../hooks/useTwBreakpoint"
import usePageSearchParams from "../hooks/usePageSearchParams"

const pageSize = 10

export const searchLoader = async ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    const tagTerm = url.searchParams.get("tag")
    const pageTerm = url.searchParams.get("page")

    const posts = await getPublicPosts({
        q: q,
        tags: tagTerm,
        pageSize: pageSize,
        page: pageTerm,
    })

    return posts
}

export default function Search() {
    const navigation = useNavigation()
    const { results: posts, metadata } = useLoaderData()
    const [currentPage, setCurrentPage] = usePageSearchParams()
    const isMd = useTwBreakpoint("md")
    const { count } = metadata

    if (navigation.state === "loading") {
        return (
            <div className="flex justify-center py-8">
                <Spinner />
            </div>
        )
    }

    let postsRender

    if (count <= 0) {
        postsRender = (
            <div className="my-4 flex flex-col gap-4">
                <SadFaceIcon size={48} className="self-center stroke-2" />
                <p className="text-center text-xl font-medium">No results</p>
            </div>
        )
    } else {
        postsRender = posts.map((post) => (
            <PostItem post={post} key={post.id} className="[&+*]:mt-12" />
        ))
    }

    return (
        <>
            <div>{postsRender}</div>
            {count > pageSize && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        showControls
                        page={currentPage}
                        onChange={setCurrentPage}
                        total={Math.floor(count / pageSize)}
                        siblings={isMd ? 1 : 0}
                    />
                </div>
            )}
        </>
    )
}
