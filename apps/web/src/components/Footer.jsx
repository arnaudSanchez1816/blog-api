import { Button, Divider, Link } from "@heroui/react"

function LinkedInIcon({ size = 24, height, width, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width || size}
            height={height || size}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
            />
        </svg>
    )
}

function GithubIcon({ size = 24, height, width, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width || size}
            height={height || size}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
            />
        </svg>
    )
}

export default function Footer() {
    return (
        <footer className="px-6 pb-6 md:pb-12">
            <div className="m-auto max-w-prose">
                <Divider
                    orientation="horizontal"
                    className="mb-8 mt-16 xl:mt-36"
                />
                <div className="[&>*]:not-first:mt-10">
                    <div>
                        <Link href="#" color="primary">
                            ↑ Back to top
                        </Link>
                    </div>
                    <div className="flex flex-col gap-x-4 gap-y-2 lg:flex-row">
                        <h2 className="text-large grow-0 basis-1/3 font-medium">
                            About
                        </h2>
                        <div>
                            <p>
                                This blog was made as a personal project to
                                practice API design. It includes a RESTful API,
                                a front-end app and a custom CMS.
                            </p>
                            <p className="mt-4">
                                This project is built with Express, Postgres,
                                Prisma, React, Tailwind and HeroUI.
                            </p>
                            <Link
                                href="/about"
                                color="foreground"
                                underline="always"
                                className="mt-6"
                            >
                                Read more…
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-x-4 gap-y-2 lg:flex-row">
                        <h2 className="text-large grow-0 basis-1/3 font-medium">
                            Socials
                        </h2>
                        <div className="flex grow gap-2">
                            <Button
                                href="https://linkedin.com/in/arnaud-sanchez-b6ba21277"
                                className="rounded-full"
                                color="default"
                                isIconOnly
                                variant="flat"
                                as={Link}
                            >
                                <LinkedInIcon size={24} />
                            </Button>
                            <Button
                                href="https://github.com/arnaudSanchez1816"
                                className="rounded-full"
                                color="default"
                                isIconOnly
                                variant="flat"
                                as={Link}
                            >
                                <GithubIcon size={24} />
                            </Button>
                        </div>
                    </div>
                </div>
                <Divider orientation="horizontal" className="my-8" />
                <div className="text-foreground/70 flex items-center justify-center gap-1 text-sm md:justify-between">
                    <p>© 2025</p>
                    <span className="md:hidden">-</span>
                    <Link
                        className="text-sm md:flex md:gap-1"
                        href="https://github.com/arnaudSanchez1816/blog-api"
                        color="foreground"
                        underline="hover"
                    >
                        <GithubIcon className="hidden md:inline-block" />
                        Source
                    </Link>
                </div>
            </div>
        </footer>
    )
}
