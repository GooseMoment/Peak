export type BooleanKeysOf<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends boolean ? K : never
}[keyof T]

export type StringLiteralKeysOf<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends string
        ? string extends NonNullable<T[K]>
            ? never
            : K
        : never
}[keyof T]
