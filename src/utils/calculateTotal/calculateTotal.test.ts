import { describe, expect, it } from "vitest"
import { calculateTotal } from "./calculateTotal"

describe("calculateTotal", () => {
    it("returns 0 for empty input", () => {
        expect(calculateTotal("")).toBe(0)
        expect(calculateTotal("   \n  ")).toBe(0)
    })

    it("sums values separated by new lines", () => {
        const amounts = "100\n100\n100"
        expect(calculateTotal(amounts)).toBe(300)
    })

    it("sums values separated by commas and new lines", () => {
        const amounts = "200, 200\n100"
        expect(calculateTotal(amounts)).toBe(500)
    })

    it("ignores invalid numeric entries", () => {
        const amounts = "100, abc\n200"
        expect(calculateTotal(amounts)).toBe(300)
    })

    it("sums floating-point values", () => {
        const amounts = "100.5, 200.25\n0.25"
        expect(calculateTotal(amounts)).toBe(301)
    })

    it("handles extra whitespace and empty entries", () => {
        const amounts = "  100  , \n\t200.5  ,   \n , 300 "
        expect(calculateTotal(amounts)).toBe(600.5)
    })
})
