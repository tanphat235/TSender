export function calculateTotal(amounts: string): number {
    if (!amounts.trim()) {
        return 0
    }

    return amounts
        .split(/[\n,]+/g)
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .reduce((sum, value) => {
            const isFloatLike = /^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(value)
            if (!isFloatLike) {
                return sum
            }
            const parsed = Number.parseFloat(value)
            return sum + parsed
        }, 0)
}
