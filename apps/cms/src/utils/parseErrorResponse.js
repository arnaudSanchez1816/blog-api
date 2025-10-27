export async function parseErrorResponse(errorResponse) {
    const { status, statusText } = errorResponse
    let error = {}
    if (errorResponse.body) {
        try {
            const errorBody = await errorResponse.json()
            error = { ...errorBody.error }
        } catch (parseError) {
            if (parseError instanceof SyntaxError == false) {
                console.error(parseError)
            }
            error = { errorMessage: statusText }
        }
    } else {
        error = { errorMessage: statusText }
    }
    error.status = status

    return error
}
