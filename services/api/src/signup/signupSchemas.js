import vine, { SimpleMessagesProvider } from "@vinejs/vine"

const signupSchema = vine.object({
    name: vine.string().trim().minLength(1).maxLength(32).escape(),
    email: vine.string().trim().email(),
    password: vine
        .string()
        .minLength(8)
        .maxLength(32)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/)
        .confirmed({
            confirmationField: "passwordConfirmation",
        }),
})

const signupValidator = vine.compile(signupSchema)

const PASSWORD_VALIDATION_MESSAGE =
    "The password field must be 8-32 characters long, contains one lower case letter, one upper case letter and one number"
signupValidator.messagesProvider = new SimpleMessagesProvider(
    {
        required: "The {{ field }} field is required",
        string: "The value of {{ field }} field must be a string",
        email: "The value is not a valid email address",
        minLength: "The {{ field }} field must be {{ min }} characters long",
        maxLength: "The {{ field }} field must be {{ max }} characters long",
        confirmed:
            "The {{ field }} field and {{ otherField }} field must be the same",
        "password.regex": PASSWORD_VALIDATION_MESSAGE,
        "password.minLength": PASSWORD_VALIDATION_MESSAGE,
        "password.maxLength": PASSWORD_VALIDATION_MESSAGE,
    },
    { passwordConfirmation: "password confirmation" }
)

export { signupValidator }
