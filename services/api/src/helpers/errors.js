export class AlreadyExistsError extends Error {
    constructor(message, { name, value }) {
        super(message)
        this.field = { name, value }
    }
}

export class AuthenticationError extends Error {
    constructor(message) {
        super(message)
    }
}
