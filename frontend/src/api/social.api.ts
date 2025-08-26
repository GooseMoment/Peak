import client, { getCurrentUsername, isAxiosErrorStatus } from "@api/client"
import type { Base, PaginationData } from "@api/common"
import type { User } from "@api/users.api"

export interface Emoji {
    id: string
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

/**
 * @deprecated use {@link Remark} instead
 */
export interface Quote extends Base {
    user: User
    content: string
    date: string
}

export interface Remark extends Base {
    user: User
    content: string
    date: string
}

export interface Stat extends User {
    completed_task_count: number
    reaction_count: number
    date: string
}

export interface TaskReactionUnicodeEmoji extends Base {
    user: User
    // TODO: replace Task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any
    unicode_emoji: string
    image_emoji: null
    emoji_name: string
}

export interface TaskReactionImageEmoji extends Base {
    user: User
    // TODO: replace Task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any
    unicode_emoji: null
    image_emoji: Emoji
    emoji_name: string
}

export type TaskReaction = TaskReactionUnicodeEmoji | TaskReactionImageEmoji

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

export const getFollowing = async (
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

export const getStat = async (username: string, date_iso: string) => {
    const res = await client.get<Stat>(`social/stats/@${username}/${date_iso}/`)
    return res.data
}

export const getStats = async (date_iso: string, page: string) => {
    const res = await client.get<PaginationData<Stat>>(
        `social/stats/${date_iso}/`,
        {
            params: { page },
        },
    )
    return res.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Task = any

export const getRecord = async (
    username: string,
    date_iso: string,
    page: string,
) => {
    const res = await client.get<PaginationData<Task>>(
        `social/records/@${username}/${date_iso}/`,
        {
            params: { page },
        },
    )

    return res.data
}

export const getExploreRecommend = async (cursor: string) => {
    const res = await client.get<PaginationData<Stat>>(`social/explore/`, {
        params: { cursor },
    })

    return res.data
}

export const getExploreFound = async (query: string, cursor: string) => {
    const params = new URLSearchParams({ query, cursor })
    const res = await client.get<PaginationData<Stat>>(
        `social/explore/search/`,
        { params },
    )
    return res.data
}

export const getRemark = async (username: string, date: string) => {
    const res = await client.get<Remark | "">(
        `social/remarks/@${username}/${date}/`,
    )
    // The data of 204 No Content is a blank string
    return res.data === "" ? null : res.data
}

// PUT performs the both CREATE and UPDATE
export const putRemark = async (date: string, content: string) => {
    const res = await client.put<Remark>(
        `social/remarks/@${getCurrentUsername()}/${date}/`,
        {
            content,
        },
    )
    return res.data
}

export const deleteRemark = async (date: string) => {
    await client.delete(`social/remarks/@${getCurrentUsername()}/${date}/`)
    return null
}

export const getEmojis = async () => {
    const res = await client.get<PaginationData<Emoji>>(`social/emojis/`)

    return res.data.results
}

export const getTaskReactions = async (taskID: string) => {
    const res = await client.get<TaskReaction[]>(
        `tasks/${taskID}/reactions/`,
        {},
    )

    return res.data
}

export type TaskReactionPost =
    | {
          unicode_emoji: string
      }
    | {
          image_emoji: string
      }

export const postTaskReaction = async (
    taskID: string,
    data: TaskReactionPost,
) => {
    const res = await client.post<TaskReaction>(
        `tasks/${taskID}/reactions/`,
        data,
    )

    return res.data
}

export const deleteTaskReaction = async (reactionID: TaskReaction["id"]) => {
    await client.delete(`social/task_reactions/${reactionID}/`)
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
    parentType: Comment["parent_type"],
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
