import { Button, Input, Link } from "@heroui/react"
import {
    Form,
    Outlet,
    useLoaderData,
    useMatches,
    useNavigation,
    useSearchParams,
} from "react-router"
import SearchIcon from "../components/Icons/SearchIcon"
import { getTags } from "../api/tags"
import { useEffect, useRef } from "react"
import Tag from "../components/Tag"

export async function asideLayoutLoader() {
    const tags = await getTags()

    return tags
}

export default function AsideLayout() {
    const { results: tags } = useLoaderData()
    const searchInputRef = useRef(null)
    const navigation = useNavigation()
    const [searchParams] = useSearchParams()
    const q = searchParams.get("q") || ""

    const matches = useMatches()
    let title = matches.filter((match) => Boolean(match.handle?.title))[0]
        ?.handle?.title

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.value = q
        }
    }, [navigation, q])

    return (
        <div className="mx-auto pt-6 xl:grid xl:grid-cols-[1fr_minmax(auto,65ch)_1fr] xl:justify-center xl:gap-x-16">
            <div className="m-auto max-w-prose xl:m-0 xl:justify-self-end">
                {title && (
                    <h1 className="text-2xl font-medium md:text-3xl">
                        {title}
                    </h1>
                )}
            </div>
            <div className="m-auto mt-8 w-full max-w-prose xl:mt-0">
                <Outlet />
            </div>
            <aside className="mx-auto mt-12 max-w-prose xl:mx-0 xl:mt-0 xl:max-w-xs">
                <Form
                    className="flex flex-nowrap gap-4"
                    method="GET"
                    action="/search"
                >
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
                        aria-label="search posts"
                        label="Find a post"
                        labelPlacement="outside-top"
                        name="q"
                        defaultValue={q}
                        ref={searchInputRef}
                    />
                    <Button
                        radius="sm"
                        className="bg-default-900 text-content1 h-[40px] self-end"
                        type="submit"
                    >
                        Search
                    </Button>
                </Form>
                <div className="mt-8">
                    <h3 className="text-lg font-medium">All tags</h3>
                    <div className="mt-6 flex max-w-full flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Tag key={tag.id} tag={tag} />
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    )
}
