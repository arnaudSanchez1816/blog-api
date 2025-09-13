import { useLoaderData } from "react-router"
import { getPublicPosts } from "../api/posts"
import PostItem from "../components/PostItem"

export async function homeLoader() {
    const posts = await getPublicPosts({
        page: 1,
        pageSize: 5,
    })

    return posts
}

export default function Home() {
    const { results: posts } = useLoaderData()

    return (
        <>
            {posts.map((post) => (
                <PostItem post={post} key={post.id} className="[&+*]:mt-12" />
            ))}
        </>
    )
}
