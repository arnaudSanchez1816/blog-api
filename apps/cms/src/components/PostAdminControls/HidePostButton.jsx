import EyeIcon from "@repo/ui/components/Icons/EyeIcon"
import { Button } from "@heroui/react"
import { HIDE_INTENT } from "../../pages/Post"

export default function HidePostButton({ postId, fetcher }) {
    const busy = fetcher.state !== "idle"
    const intent = fetcher.formData?.get("intent") || null
    const isBusyButton = intent === HIDE_INTENT
    return (
        <fetcher.Form method="PUT" action={`/posts/${postId}`}>
            <Button
                color="warning"
                startContent={<EyeIcon eyeOpen={false} />}
                className="w-full font-medium"
                isLoading={busy && isBusyButton}
                isDisabled={busy && !isBusyButton}
                type="submit"
                name="intent"
                spinnerPlacement="end"
                value={HIDE_INTENT}
            >
                Hide
            </Button>
        </fetcher.Form>
    )
}
