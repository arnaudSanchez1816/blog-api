import {
    Button,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react"
import { useId, useRef, useState } from "react"
import { z } from "zod"
import { tagSchema } from "@repo/zod-schemas"
import { useFetcher } from "react-router"

export default function NewTagModal({ isOpen, setOpen }) {
    const formId = useId()
    const [errors, setErrors] = useState(null)
    const formRef = useRef(null)
    const fetcher = useFetcher()
    const isLoading = fetcher.state !== "idle"

    const onSubmit = async (e) => {
        e.preventDefault()
        const form = e.currentTarget

        const formDataObj = Object.fromEntries(new FormData(form))

        try {
            setErrors(null)
            // Check form validation
            const createTagValidator = tagSchema.pick({
                name: true,
                slug: true,
            })
            await createTagValidator.parseAsync(formDataObj)
            // Submit form
            await fetcher.submit(form)
            // Handle possible errors or close modal if success
            const { data } = fetcher
            if (data?.error) {
                throw data.error
            }

            setOpen(false)
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(z.flattenError(error).fieldErrors)
            }

            const { details } = error
            if (details) {
                setErrors(details)
            }
        }
    }

    const onOpenChange = (isOpen) => {
        if (isLoading) {
            return
        }

        if (!isOpen) {
            formRef.current.reset()
            setErrors(null)
        }
        setOpen(isOpen)
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton={isLoading}
            isDismissable={!isLoading}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Create a new tag
                        </ModalHeader>
                        <ModalBody>
                            <Form
                                ref={formRef}
                                id={formId}
                                onSubmit={onSubmit}
                                validationErrors={errors}
                                action="/tags"
                                method="post"
                            >
                                <Input
                                    type="text"
                                    name="name"
                                    label="Name"
                                    isRequired
                                    labelPlacement="outside-top"
                                    isDisabled={isLoading}
                                />
                                <Input
                                    type="text"
                                    name="slug"
                                    label="Slug"
                                    isRequired
                                    labelPlacement="outside-top"
                                    isDisabled={isLoading}
                                    errorMessage={({ validationErrors }) => (
                                        <ul>
                                            {validationErrors.map(
                                                (error, i) => (
                                                    <li key={i}>{error}</li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                />
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => setOpen(false)}
                                isDisabled={isLoading}
                            >
                                Close
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                form={formId}
                                isLoading={isLoading}
                            >
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
