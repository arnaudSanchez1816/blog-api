export const fetchTags = async () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const url = new URL(`./tags`, apiUrl)

    const response = await fetch(url, { mode: "cors" })
    if (!response.ok) {
        throw response
    }

    const tags = await response.json()

    return tags
}

export const deleteTag = async (idOrSlug, accessToken) => {
    const apiUrl = import.meta.env.VITE_API_URL
    const url = new URL(`./tags/${idOrSlug}`, apiUrl)

    const response = await fetch(url, {
        mode: "cors",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    })
    if (!response.ok) {
        throw response
    }

    const body = await response.json()
    return body
}

export const editTag = async ({ name, slug }, idOrSlug, accessToken) => {
    const apiUrl = import.meta.env.VITE_API_URL
    const url = new URL(`./tags/${idOrSlug}`, apiUrl)

    const response = await fetch(url, {
        mode: "cors",
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, slug }),
    })
    if (!response.ok) {
        throw response
    }

    const updatedTag = await response.json()
    return updatedTag
}

export const createTag = async ({ name, slug }, accessToken) => {
    const apiUrl = import.meta.env.VITE_API_URL
    const url = new URL(`./tags`, apiUrl)

    const response = await fetch(url, {
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, slug }),
    })
    if (!response.ok) {
        throw response
    }

    const createdTag = await response.json()
    return createdTag
}
