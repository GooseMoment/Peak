export type UUID = string

export interface Base {
    id: UUID
    created_at: string
    updated_at: string
    deleted_at: null | string
}

export interface PaginationData<T> {
    next: null | string
    prev: null | string
    results: T[]
}

export type Privacy = "public" | "protected" | "private"
