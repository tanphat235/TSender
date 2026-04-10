"use client"
import InputField from "./ui/InputField"
import { useState } from "react"

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")

    async function handleSubmit() {
        console.log(tokenAddress, recipients, amounts)
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
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
            Send Token
            </button>
        </div>
    )
}