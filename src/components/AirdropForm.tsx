"use client"
import InputField from "./ui/InputField"
import { useState, useMemo, useEffect } from "react"
import {chainsToTSender, tsenderAbi, erc20Abi} from "@/constants"
import { useChainId, useConfig, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { readContract } from "@wagmi/core"
import { calculateTotal } from "@/utils"


export default function AirdropForm() {
    // Form inputs (user-provided values).
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")

    // Wagmi context: current chain + connected wallet.
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()

    // Derived value from the `amounts` input string.
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const { data: hash, isPending, writeContractAsync } = useWriteContract()

    useEffect(() => {
        console.log("total amount:", total)
    }, [total])

    // Read how much the `tsender` contract is allowed to spend from `account.address`.
    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found for this chain")
            return 0
        }
        // ERC-20 allowance(owner, spender)
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address as `0x${string}`, tSenderAddress as `0x${string}`],
        })

        // `allowance` returns uint256; cast for this UI.
        return response as number
    }

    // Submit flow:
    // 1) Check allowance
    // 2) If insufficient, send ERC-20 `approve(tsender, total)`
    // (Further steps like calling `airdropERC20` are not implemented in this file yet.)
    async function handleSubmit() {
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)

        if (approvedAmount < total) {
            // Send a write transaction to the ERC-20 token contract.
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)],
            })
        }
    }

    // Render the form UI.
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