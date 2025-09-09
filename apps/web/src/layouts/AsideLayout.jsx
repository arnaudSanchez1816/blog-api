import { Button, Input, Link } from "@heroui/react"
import { Outlet, useLoaderData } from "react-router"
import SearchIcon from "../components/SearchIcon"
import { getTags } from "../api/tags"

export async function asideLayoutLoader() {
    const tags = await getTags()

    return tags
}

export default function AsideLayout() {
    const { results: tags } = useLoaderData()

    return (
        <div className="mx-auto pt-6 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:justify-center xl:gap-x-16">
            <Outlet />
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
                        {tags.map((tag) => (
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
