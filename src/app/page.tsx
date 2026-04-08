"use client"

import dynamic from "next/dynamic"
import Header from "@/components/Header"

const HomeContent = dynamic(() => import("@/components/HomeContent"), {
    ssr: false,
})

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <HomeContent />
        </div>
    )
}
