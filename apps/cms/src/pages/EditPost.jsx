import { fetchPost } from "@repo/client-api/posts"
import { postSchema } from "@repo/zod-schemas"
import {
    Form,
    useBlocker,
    useLoaderData,
    useNavigation,
    useSubmit,
} from "react-router"
import { useCallback, useState } from "react"
import { Button, Divider } from "@heroui/react"
import { fetchTags } from "@repo/client-api/tags"
import _ from "lodash"
import EditablePostTitle from "../components/EditablePostTitle"
import EditTagsSection from "../components/EditTagsSection"
import EditPostContentSection from "../components/EditPostContentSection"
import ThreeColumnLayout from "../layouts/ThreeColumnLayout"
import SaveIcon from "@repo/ui/components/Icons/SaveIcon"

export async function editPostLoader({ params }, accessToken) {
    const postIdSchema = postSchema.pick({ id: true })
    const { id } = await postIdSchema.parseAsync({ id: params.postId })

    const [post, allTags] = await Promise.all([
        fetchPost(id, accessToken),
        fetchTags(),
    ])
    return { post, allTags: allTags.results }
}

function EditPostLayout({ children, left, right }) {
    return <ThreeColumnLayout left={left} right={right} center={children} />
}

export default function EditPost() {
    const { post } = useLoaderData()
    const [isDirty, setIsDirty] = useState(false)
    const blocker = useBlocker(useCallback(() => isDirty, [isDirty]))
    const navigation = useNavigation()
    const submit = useSubmit()

    const isSaving = navigation.state !== "idle"

    const onSave = (e) => {
        e.preventDefault()
    }

    return (
        <EditPostLayout
            left={
                <div className="min-w-38">
                    <p className="text-2xl font-medium xl:text-3xl">
                        Edit post
                    </p>
                    <Button
                        isLoading={isSaving}
                        color="primary"
                        size="md"
                        className="min-sm:max-xl:max-w-32 mt-4 w-full font-medium"
                        onPress={onSave}
                        startContent={<SaveIcon />}
                    >
                        Save
                    </Button>
                </div>
            }
        >
            <EditablePostTitle post={post} />
            <div className="mt-4">
                <EditTagsSection post={post} />
            </div>
            <Divider className="mt-4" />
            <EditPostContentSection post={post} />
        </EditPostLayout>
    )
}
