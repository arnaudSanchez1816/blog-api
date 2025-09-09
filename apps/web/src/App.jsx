import { HeroUIProvider } from "@heroui/react"
import Header from "./components/Header"
import { Outlet, ScrollRestoration, useHref, useNavigate } from "react-router"
import Footer from "./components/Footer"

export default function App() {
    const navigate = useNavigate()

    return (
        <>
            <HeroUIProvider navigate={navigate} useHref={useHref}>
                <ScrollRestoration />
                <Header />
                <main className="px-6">
                    <Outlet />
                </main>
                <Footer />
            </HeroUIProvider>
        </>
    )
}
