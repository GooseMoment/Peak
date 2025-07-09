import client, { getCurrentUsername, isAxiosErrorStatus } from "@api/client"
import type { Base, PaginationData } from "@api/common"
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

export const getFollow = async (
    followerUsername: string,
    followeeUsername: string,
) => {
    try {
        const res = await client.get<Following>(
            `social/followings/@${followerUsername}/@${followeeUsername}/`,
        )
        return res.data
    } catch (e) {
        if (isAxiosErrorStatus(e, 404)) {
            return null
        }
        throw e
    }
}

// send (user: sender)
// username: receiver's
export const putFollowRequest = async (username: string) => {
    const follower = getCurrentUsername()
    const followee = username

    const res = await client.put<Following>(
        `social/followings/@${follower}/@${followee}/`,
    )

    if (res.status === 208) {
        throw new Error("Following already exists.")
    }

    return res.data
}

// accept or reject (user: receiver)
// username: sender's
export const patchFollowRequest = async (username: string, accept: boolean) => {
    const follower = username
    const followee = getCurrentUsername()

    const res = await client.patch<Following>(
        `social/followings/@${follower}/@${followee}/`,
        {
            status: accept ? "accepted" : "rejected",
        },
    )

    return res.data
}

// cancel (user: sender)
// username: receiver's
export const deleteFollowRequest = async (username: string) => {
    const follower = getCurrentUsername()
    const followee = username

    const res = await client.delete<Following>( // DELETE Following does not delete the row but insert `deleted_at`
        `social/followings/@${follower}/@${followee}/`,
    )

    return res.data
}

export const getFollowersByUser = async (username: string, page: string) => {
    const res = await client.get<PaginationData<User>>(
        `users/@${username}/followers/`,
        {
            params: { page },
        },
    )

    return res.data
}

export const getFollowingsByUser = async (username: string, page: string) => {
    const res = await client.get<PaginationData<User>>(
        `users/@${username}/followings/`,
        {
            params: { page },
        },
    )

    return res.data
}

export const getRequestersByUser = async (username: string, page: string) => {
    const res = await client.get<PaginationData<User>>(
        `users/@${username}/requesters/`,
        {
            params: { page },
        },
    )

    return res.data
}
export const getBlock = async (username: string) => {
    try {
        const res = await client.get<Block>(
            `social/blocks/@${getCurrentUsername()}/@${username}/`,
        )
        return res.data
    } catch (e) {
        if (isAxiosErrorStatus(e, 404)) {
            return null
        }

        throw e
    }
}

export const putBlock = async (username: string) => {
    const res = await client.put<Block>(
        `social/blocks/@${getCurrentUsername()}/@${username}/`,
    )
    return res.data
}

export const deleteBlock = async (username: string) => {
    const res = await client.delete(
        `social/blocks/@${getCurrentUsername()}/@${username}/`,
    )
    return res.data
}

// TODO: declare DailyLogsPreview
export const getDailyLogsPreview = async (username: string, day: string) => {
    const res = await client.get(`social/daily/logs/@${username}/${day}/`)

    return res.data
}

// TODO: declare DailyLogDetail
export const getDailyLogDetails = async (
    username: string,
    day: string,
    cursor: string,
) => {
    const res = await client.get(
        `social/daily/log/details/@${username}/${day}/`,
        { params: { cursor } },
    )

    return res.data
}

export const getExploreRecommend = async (cursor: string) => {
    const res = await client.get<PaginationData<User>>(`social/explore/`, {
        params: { cursor },
    })

    return res.data
}

export const getExploreFound = async (query: string, cursor: string) => {
    const params = new URLSearchParams({ query, cursor })
    const res = await client.get<PaginationData<User>>(
        `social/explore/search/`,
        { params },
    )
    return res.data
}

export const getQuote = async (username: string, day: string) => {
    const res = await client.get<Quote>(`social/quotes/@${username}/${day}/`)

    return res.data
}

export const postQuote = async (date: string, content: string) => {
    const res = await client.post<Quote>(`social/quotes/${date}/`, {
        content,
    })

    return res.data
}

export const getEmojis = async () => {
    const res = await client.get<PaginationData<Emoji>>(`social/emojis/`)

    return res.data.results
}

export const getReactions = async (
    parentType: Reaction["parent_type"],
    parentID: string, // TODO: replace string with Task["id"] | Quote["id"]
) => {
    const res = await client.get<PaginationData<Reaction>>(
        `social/reactions/${parentType}/${parentID}/`,
    )

    return res.data
}

export const postReaction = async (
    parentType: Reaction["parent_type"],
    parentID: string,
    emoji: Emoji["name"], // TODO: replace Emoji["name"] with Emoji
) => {
    const res = await client.post<Reaction>(
        `social/reactions/${parentType}/${parentID}/`,
        {
            emoji: emoji,
        },
    )

    return res.data
}

export const deleteReaction = async (
    parentType: Reaction["parent_type"],
    parentID: string,
    emoji: Emoji["name"],
) => {
    const params = new URLSearchParams({ emoji: emoji })

    const res = await client.delete(
        `social/reactions/${parentType}/${parentID}/`,
        { params },
    )

    return res.status
}

export const getPeck = async (taskID: string) => {
    const res = await client.get<Peck>(`social/pecks/${taskID}/`)

    return res.data
}

export const postPeck = async (taskID: string) => {
    const res = await client.post<Peck>(`social/pecks/${taskID}/`)

    return res.data
}

export const getComment = async (
    parentType: Comment["parent_type"],
    parentID: string,
) => {
    const res = await client.get<Comment[]>(
        `social/comments/${parentType}/${parentID}/`,
    ) // TODO: use pagination

    return res.data
}

export const postComment = async (
    parentType: Comment["parent_type"],
    parentID: string,
    content: string,
) => {
    const res = await client.post<Comment>(
        `social/comments/${parentType}/${parentID}/`,
        {
            comment: content,
        },
    )

    return res.data
}

export const patchComment = async (
    parentType: Comment["parent_type"],
    parentID: string,
    commentID: Comment["id"],
    content: string,
) => {
    const res = await client.patch<Comment>(
        `social/comments/${parentType}/${parentID}/`,
        {
            id: commentID,
            comment: content,
        },
    )
    return res.data
}

export const deleteComment = async (
    parentType: Comment["comment"],
    parentID: string,
    commentID: Comment["id"],
) => {
    const res = await client.delete(
        `social/comments/${parentType}/${parentID}/`,
        {
            data: { id: commentID },
        },
    )

    return res.status
}
