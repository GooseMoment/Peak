// functions which can be used in arr.sort()

export function compareFn(a: string, b: string): number {
    if (a < b) {
        return -1
    }

    if (a > b) {
        return 1
    }

    return 0
}
