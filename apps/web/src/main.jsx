import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HeroUIProvider } from "@heroui/react"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import "./style.css"

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
})

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HeroUIProvider>
            <RouterProvider router={router} />
        </HeroUIProvider>
    </StrictMode>
)
