import { fetchPost } from "@repo/client-api/posts"
import { postSchema } from "@repo/zod-schemas"
import { Form, useLoaderData, useNavigation, useSubmit } from "react-router"
import { useState } from "react"
import { Button, Divider, Textarea } from "@heroui/react"
import PostMarkdown from "@repo/ui/components/PostMarkdown"
import { fetchTags } from "@repo/client-api/tags"
import _ from "lodash"
import EditablePostTitle from "../components/EditablePostTitle"
import EditTagsSection from "../components/EditTagsSection"

export async function editPostLoader({ params }, accessToken) {
    const postIdSchema = postSchema.pick({ id: true })
    const { id } = await postIdSchema.parseAsync({ id: params.postId })

    const [post, allTags] = await Promise.all([
        fetchPost(id, accessToken),
        fetchTags(),
    ])
    return { post, allTags: allTags.results }
}

export default function EditPost() {
    const { post } = useLoaderData()
    const { id, body } = post
    const [textValue, setTextValue] = useState(body)
    const submit = useSubmit()
    const navigation = useNavigation()

    const isSaving = navigation.state !== "idle"

    const onSave = (e) => {
        e.preventDefault()
    }

    return (
        <div className="pt-6">
            <div className="mx-auto max-w-prose">
                <EditablePostTitle post={post} />
                <div className="mt-4">
                    <EditTagsSection post={post} />
                </div>
                <Divider className="mt-4" />
            </div>
            <div className="mx-auto mt-8 grid w-fit grid-cols-[repeat(2,65ch)] grid-rows-[repeat(3,auto)] gap-x-24 gap-y-4">
                <h3 className="text-2xl font-medium">Post content</h3>
                <h4 className="text-2xl font-medium">Preview</h4>
                <div>
                    <Textarea
                        value={textValue}
                        aria-label="Post edit area"
                        variant="faded"
                        minRows={25}
                        maxRows={25}
                        onValueChange={setTextValue}
                        size="lg"
                    ></Textarea>
                </div>
                <div className="max-h-[600px] overflow-y-scroll">
                    <PostMarkdown>{textValue}</PostMarkdown>
                </div>
                <div className="col-span-2">
                    <Form
                        method="PUT"
                        action={`/posts/${id}`}
                        onSubmit={onSave}
                    >
                        <Button
                            isLoading={isSaving}
                            type="submit"
                            color="primary"
                            size="lg"
                            className="font-medium"
                        >
                            Save
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}
