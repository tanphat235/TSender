"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"

export default function Header() {
    return (
        <header className="w-full border-b border-white/10 px-4 py-3">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="https://github.com/tanphat235"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open GitHub"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10"
                    >
                        <FaGithub size={18} />
                    </Link>

                    <div className="flex items-center gap-2">
                        <Image src="/file.svg" alt="Tsender logo" width={20} height={20} />
                        <span className="text-lg font-semibold tracking-wide text-white">tsender</span>
                    </div>
                </div>

                <ConnectButton />
            </div>
        </header>
    )
}