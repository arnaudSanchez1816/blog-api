import { useLoaderData } from "react-router"
import { getPublicPosts } from "../api/posts"
import PostPreview from "../components/PostPreview"
import { getTags } from "../api/tags"
import { Button, Link } from "@heroui/react"

export async function homeLoader() {
    const [posts, tags] = await Promise.all([
        getPublicPosts({
            page: 1,
            pageSize: 5,
        }),
        getTags(),
    ])

    return {
        posts,
        tags,
    }
}

export default function Home() {
    const { posts, tags } = useLoaderData()
    const { results: allPosts } = posts
    const { results: allTags } = tags

    return (
        <div className="mx-auto pt-6 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:justify-center xl:gap-x-16">
            <div className="m-auto max-w-prose xl:col-start-2">
                <h1 className="text-3xl font-bold">Latest posts</h1>
                <div className="mt-6">
                    {allPosts.map((post) => (
                        <PostPreview post={post} key={post.id} />
                    ))}
                </div>
            </div>
            <aside className="mx-auto mt-12 max-w-prose xl:mx-0 xl:mt-0 xl:max-w-xs">
                <div>
                    <h3 className="text-xl font-bold">All tags</h3>
                    <div className="mt-6 flex max-w-full flex-wrap gap-2">
                        {allTags.map((tag) => (
                            <Button
                                key={tag.id}
                                color="secondary"
                                as={Link}
                                href={`/search?tag=${tag.id}`}
                                size="sm"
                                radius="full"
                            >
                                {tag.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    )
}
