import vine, { SimpleMessagesProvider } from "@vinejs/vine"

const loginSchema = vine.object({
    email: vine.string().trim().email(),
    password: vine.string(),
})

const loginValidator = vine.compile(loginSchema)

export { loginValidator }
