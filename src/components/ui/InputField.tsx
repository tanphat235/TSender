"use client"

import {
    useId,
    type HTMLInputTypeAttribute,
} from "react"

export type InputFieldProps = {
    label: string
    placeholder: string
    value: string
    type?: HTMLInputTypeAttribute
    /** When true, renders a multi-line textarea instead of a single-line input. */
    large?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const fieldClassName =
    "w-full rounded-md border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500/50"

export default function InputField({
    label,
    placeholder,
    value,
    type = "text",
    large = false,
    onChange,
}: InputFieldProps) {
    const id = useId()

    return (
        <div className="flex w-full flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-zinc-200">
                {label}
            </label>
            {large ? (
                <textarea
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={6}
                    className={`${fieldClassName} min-h-32 resize-y`}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={fieldClassName}
                />
            )}
        </div>
    )
}
