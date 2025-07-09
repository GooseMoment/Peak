import type { Base } from "@api/common"
import { type User } from "@api/users.api"

export interface Emoji extends Base {
    name: string
    img: string
}

export interface Peck extends Base {
    user: User
    // TODO: replace Task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any
    count: number
}

export interface Quote extends Base {
    user: User
    content: string
    date: string
}

export interface ReactionTask extends Base {
    user: User
    parent_type: "task"
    // TODO: replace Task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any
    emoji: Emoji
}

export interface ReactionQuote extends Base {
    user: User
    parent_type: "quote"
    quote: Quote
    emoji: Emoji
}

export type Reaction = ReactionTask | ReactionQuote

export interface CommentTask extends Base {
    user: User
    parent_type: "task"
    // TODO: replace Task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any
    comment: string
}

export interface CommentQuote extends Base {
    user: User
    parent_type: "quote"
    quote: Quote
    comment: string
}

export type Comment = CommentTask | CommentQuote

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
