import { Chip, Link } from "@heroui/react"

export default function TagLink({ tag }) {
    return (
        <Chip
            color="secondary"
            as={Link}
            href={`/search?tag=${tag.slug}`}
            size="md"
        >
            {tag.name}
        </Chip>
    )
}
