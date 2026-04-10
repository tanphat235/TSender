"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import Link from "next/link"
import { FaChevronDown } from "react-icons/fa"
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

                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        mounted,
                        authenticationStatus,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                    }) => {
                        const ready = mounted && authenticationStatus !== "loading"
                        const connected = ready && account && chain

                        if (!connected) {
                            return (
                                <button
                                    onClick={openConnectModal}
                                    type="button"
                                    className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                                >
                                    Connect Wallet
                                </button>
                            )
                        }

                        if (chain.unsupported) {
                            return (
                                <button
                                    onClick={openChainModal}
                                    type="button"
                                    className="inline-flex h-10 items-center justify-center rounded-full bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400"
                                >
                                    Wrong Network
                                </button>
                            )
                        }

                        return (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={openChainModal}
                                    type="button"
                                    className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-900 px-3 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-zinc-800"
                                >
                                    {chain.hasIcon && chain.iconUrl ? (
                                        <img
                                            alt={chain.name ?? "Chain icon"}
                                            src={chain.iconUrl}
                                            className="h-5 w-5 rounded-full"
                                        />
                                    ) : null}
                                    <span>{chain.name}</span>
                                    <FaChevronDown className="h-3 w-3 text-zinc-300" />
                                </button>

                                <button
                                    onClick={openAccountModal}
                                    type="button"
                                    className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                                >
                                    <span>{account.displayName}</span>
                                    {account.displayBalance ? (
                                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                                            {account.displayBalance}
                                        </span>
                                    ) : null}
                                </button>
                            </div>
                        )
                    }}
                </ConnectButton.Custom>
            </div>
        </header>
    )
}