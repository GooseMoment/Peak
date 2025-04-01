import { type User } from "@api/users.api"

export interface Following {
    follower: User
    followee: User
    status: "requested" | "accepted" | "rejected" | "canceled"
    created_at: string
    updated_at: string
    deleted_at: string
}

export interface Block {
    blocker: User
    blockee: User
    created_at: string
    updated_at: string
    deleted_at: string
}
