import { useLoaderData } from "react-router"
import { getPublicPosts } from "../api/posts"
import PostPreview from "../components/PostPreview"
import { getTags } from "../api/tags"
import { Button, Input, Link } from "@heroui/react"
import SearchIcon from "../components/SearchIcon"

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
            <div className="m-auto max-w-prose xl:m-0 xl:justify-self-end">
                <h1 className="text-3xl font-medium">Latest posts</h1>
            </div>
            <div className="m-auto mt-8 max-w-prose xl:mt-0">
                {allPosts.map((post) => (
                    <PostPreview
                        post={post}
                        key={post.id}
                        className="[&+*]:mt-12"
                    />
                ))}
            </div>
            <aside className="mx-auto mt-12 max-w-prose xl:mx-0 xl:mt-0 xl:max-w-xs">
                <form className="flex flex-nowrap gap-4">
                    <Input
                        classNames={{
                            input: "text-sm",
                            inputWrapper:
                                "font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 h-[40px]",
                            label: "text-lg font-medium",
                        }}
                        size="sm"
                        startContent={<SearchIcon size={18} />}
                        type="search"
                        label="Find a post"
                        labelPlacement="outside-top"
                    />
                    <Button
                        radius="sm"
                        className="bg-default-900 text-content1 h-[40px] self-end"
                    >
                        Search
                    </Button>
                </form>
                <div className="mt-8">
                    <h3 className="text-lg font-medium">All tags</h3>
                    <div className="mt-6 flex max-w-full flex-wrap gap-2">
                        {allTags.map((tag) => (
                            <Button
                                key={tag.id}
                                color="secondary"
                                as={Link}
                                href={`/search?tag=${tag.id}`}
                                size="sm"
                                radius="sm"
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
