import EyeIcon from "@repo/ui/components/Icons/EyeIcon"
import { Button } from "@heroui/react"
import { PUBLISH_INTENT } from "../../actions/posts"

export default function PublishPostButton({ postId, fetcher }) {
    const busy = fetcher.state !== "idle"
    const intent = fetcher.formData?.get("intent") || null
    const isBusyButton = intent === PUBLISH_INTENT
    return (
        <fetcher.Form method="PUT" action={`/posts/${postId}`}>
            <Button
                color="secondary"
                startContent={<EyeIcon eyeOpen />}
                className="w-full font-medium"
                isLoading={busy && isBusyButton}
                isDisabled={busy && !isBusyButton}
                type="submit"
                name="intent"
                spinnerPlacement="end"
                value={PUBLISH_INTENT}
            >
                Publish
            </Button>
        </fetcher.Form>
    )
}
