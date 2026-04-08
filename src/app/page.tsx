"use client"

import dynamic from "next/dynamic"

const HomeContent = dynamic(() => import("@/components/HomeContent"), {
    ssr: false,
})

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white">
            <HomeContent />
        </div>
    )
}
