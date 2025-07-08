export type UUID = string

export interface Base {
    id: UUID
    created_at: string
    updated_at: string
}

export interface PaginationData<T> {
    next: null | string
    prev: null | string
    results: T[]
}
