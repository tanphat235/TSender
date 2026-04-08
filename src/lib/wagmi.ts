import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet } from "wagmi/chains"

export const wagmiConfig = getDefaultConfig({
    appName: "tsender",
    projectId: "tsender-demo-project-id",
    chains: [mainnet],
    ssr: true,
})
