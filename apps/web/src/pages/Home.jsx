import { useLoaderData } from "react-router"
import { getPublicPosts } from "../api/posts"
import PostPreview from "../components/PostPreview"

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
                <PostPreview
                    post={post}
                    key={post.id}
                    className="[&+*]:mt-12"
                />
            ))}
        </>
    )
}
