import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { anvil, mainnet } from "wagmi/chains"

// Create a local Anvil chain config but customize the native currency label.
// This does not change the chain itself; it only affects how the app formats/display the native token.
const anvilWithEth = {
    ...anvil,
    nativeCurrency: {
        ...anvil.nativeCurrency,
        name: "Ether",
        symbol: "ETH",
    },
}

// Build the Wagmi/RainbowKit configuration used by <WagmiProvider>.
export const wagmiConfig = getDefaultConfig({
    appName: "tsender",
    projectId: "tsender-demo-project-id",
    // Chains the UI can interact with (read/write, wallet switching, etc.)
    chains: [mainnet, anvilWithEth],
    // Enable SSR-related behavior for Next.js apps.
    // (The config can be used on the server side to avoid hydration mismatches.)
    ssr: true,
})
