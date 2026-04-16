"use client"

import "@rainbow-me/rainbowkit/styles.css"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "@/lib/wagmi"

type ProvidersProps = {
    children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        // Supplies Wagmi hooks (useAccount, useWriteContract, etc.) with the configured chains/providers.
        <WagmiProvider config={wagmiConfig}>
            // Enables React Query features used by some Wagmi/RainbowKit internals.
            <QueryClientProvider client={queryClient}>
                // Provides wallet connection UI/logic (RainbowKit).
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
