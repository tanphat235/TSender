import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { anvil, mainnet } from "wagmi/chains"

const anvilWithEth = {
    ...anvil,
    nativeCurrency: {
        ...anvil.nativeCurrency,
        name: "Ether",
        symbol: "ETH",
    },
}

export const wagmiConfig = getDefaultConfig({
    appName: "tsender",
    projectId: "tsender-demo-project-id",
    chains: [mainnet, anvilWithEth],
    ssr: true,
})
