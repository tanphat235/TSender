"use client"
import InputField from "./ui/InputField"
import { useState } from "react"
import {chainsToTSender, tsenderAbi, erc20Abi} from "@/constants"
import { useChainId, useConfig, useAccount } from "wagmi"
import { readContract } from "@wagmi/core"


export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found for this chain")
            return 0
        }
        // read from the chain to see if we have approved enough token
        // allowance
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address as `0x${string}`, tSenderAddress as `0x${string}`],
        })
        // token/allowance(account, tsender)
        return response as number
    }

    async function handleSubmit() {
        // 1. If already approved, skip this step
        // 2. Approve our tsender contract to spend the token on behalf of the user
        // 3. Call the airdrop function on the tsender contract
        // 4. wait for the transaction to be mined and then show a success message
        // 5. Show an error message if something goes wrong
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        console.log("tSenderAddress", tSenderAddress)
        console.log("chainId", chainId)
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        console.log("approvedAmount", approvedAmount)
    }
    // if that field thing that we made changes, update the tokenAddress and then rerender the whole page
    return (
        <div>
            <InputField 
            label="Token Address" 
            placeholder="0x" 
            value={tokenAddress} 
            onChange={(e) => setTokenAddress(e.target.value)}
            />
            <InputField 
            label="Recipients" 
            placeholder="0x, 0x, 0x..." 
            value={recipients} 
            onChange={(e) => setRecipients(e.target.value)}
            large={true}
            />
            <InputField
            label="Amount"
            placeholder="100, 200, 300..."
            value={amounts}
            onChange={(e) => setAmounts(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-400 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
                Send Token
            </button>
        </div>
    )
}