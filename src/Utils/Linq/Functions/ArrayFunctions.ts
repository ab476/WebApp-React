export function sum(array: number[]): number {
    return array.reduce((prev, curr) => prev + curr, 0)
}