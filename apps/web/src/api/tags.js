const tags = [
    {
        id: 1,
        name: "JavaScript",
    },
    {
        id: 2,
        name: "React",
    },
    {
        id: 3,
        name: "Express",
    },
    {
        id: 4,
        name: "Frontend",
    },
    {
        id: 5,
        name: "Backend",
    },
    {
        id: 6,
        name: "CSS",
    },
    {
        id: 7,
        name: "TypeScript",
    },
    {
        id: 8,
        name: "Tools",
    },
    {
        id: 9,
        name: "Postgres",
    },
    {
        id: 10,
        name: "Vite",
    },
]

export const getTags = async () => {
    const fetchTags = await new Promise((resolve) => {
        setTimeout(() => resolve(tags), 150)
    })

    return {
        count: fetchTags.length,
        results: fetchTags,
    }
}
