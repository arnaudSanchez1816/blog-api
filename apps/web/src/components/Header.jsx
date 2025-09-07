import {
    Input,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@heroui/react"
import { useState } from "react"
import { useLocation } from "react-router"
import NavLink from "./NavLink"

function BlogLogo({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentcolor"
            {...props}
        >
            <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h462l198 198v462q0 24-18 42t-42 18H180Zm0-60h600v-428.57H609V-780H180v600Zm99-111h402v-60H279v60Zm0-318h201v-60H279v60Zm0 159h402v-60H279v60Zm-99-330v171.43V-780v600-600Z" />
        </svg>
    )
}

function SearchIcon({ size = 24, strokeWidth = 1.5, width, height, ...props }) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={height || size}
            role="presentation"
            viewBox="0 0 24 24"
            width={width || size}
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
        </svg>
    )
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    const locationPathname = location.pathname

    return (
        <Navbar
            isBordered
            disableAnimation
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            classNames={{
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "data-[active=true]:font-semibold",
                    "data-[active=true]:after:content-['']",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-0",
                    "data-[active=true]:after:left-0",
                    "data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[2px]",
                    "data-[active=true]:after:rounded-[2px]",
                    "data-[active=true]:after:bg-primary",
                ],
            }}
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link href="/" color="foreground">
                        <BlogLogo className="h-8 w-8 md:h-12 md:w-12" />
                        <p className="ml-2 font-bold text-inherit md:text-2xl">
                            Blog API
                        </p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent
                className="hidden gap-4 font-medium sm:flex"
                justify="center"
            >
                <NavbarItem isActive={locationPathname === "/posts"}>
                    <NavLink
                        href="/posts"
                        className={(isActive) => {
                            return isActive ? "text-primary" : "text-foreground"
                        }}
                    >
                        Posts
                    </NavLink>
                </NavbarItem>
                <NavbarItem isActive={locationPathname === "/about"}>
                    <NavLink
                        href="/about"
                        className={(isActive) => {
                            return isActive ? "text-primary" : "text-foreground"
                        }}
                    >
                        About
                    </NavLink>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end" as="div">
                <Input
                    classNames={{
                        base: "max-w-full sm:max-w-[10rem] h-10",
                        mainWrapper: "h-full",
                        input: "text-xs md:text-sm",
                        inputWrapper:
                            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                    }}
                    placeholder="Search posts"
                    size="sm"
                    startContent={<SearchIcon size={18} />}
                    type="search"
                />
            </NavbarContent>
            <NavbarMenu>
                <NavbarMenuItem>
                    <Link
                        className="w-full"
                        color="foreground"
                        href="/"
                        size="lg"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        className="w-full"
                        color="foreground"
                        href="/posts"
                        size="lg"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        Posts
                    </Link>
                    <Link
                        className="w-full"
                        color="foreground"
                        href="/about"
                        size="lg"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        About
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}
