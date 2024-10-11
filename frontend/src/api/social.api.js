import client, { getCurrentUsername } from "@api/client"

export const getFollow = async (follower, followee) => {
    try {
        const res = await client.get(`social/follow/@${follower}/@${followee}/`)
        return res.data
    } catch (e) {
        if (e.response.status === 404) {
            return false
        }
        throw e
    }
}

// send (user: sender)
// username: receiver's
export const putFollowRequest = async (username) => {
    const follower = getCurrentUsername()
    const followee = username

    const res = await client.put(`social/follow/@${follower}/@${followee}/`)

    if (res.status === 208) {
        throw new Error("Following already exists.")
    }

    return res.data
}

// accept or reject (user: receiver)
// username: sender's
export const patchFollowRequest = async (username, accept) => {
    const follower = username
    const followee = getCurrentUsername()

    const res = await client.patch(`social/follow/@${follower}/@${followee}/`, {
        status: accept ? "accepted" : "rejected",
    })

    return res.data
}

// cancel (user: sender)
// username: receiver's
export const deleteFollowRequest = async (username) => {
    const follower = getCurrentUsername()
    const followee = username

    const res = await client.delete(`social/follow/@${follower}/@${followee}/`)

    return res.data
}

export const getFollowersByUser = async (username) => {
    const res = await client.get(`users/@${username}/followers/`)

    return res.data
}

export const getFollowingsByUser = async (username) => {
    const res = await client.get(`users/@${username}/followings/`)

    return res.data
}

export const getRequestersByUser = async (username) => {
    const res = await client.get(`users/@${username}/requesters/`)

    return res.data
}

export const putBlock = (username) => {
    return client.put(`social/block/@${getCurrentUsername()}/@${username}/`)
}

export const deleteBlock = (username) => {
    return client.delete(`social/block/@${getCurrentUsername()}/@${username}/`)
}

export const getDailyLogsPreview = async (username, day) => {
    const res = await client.get(`social/daily/logs/@${username}/${day}/`)

    return res.data
}

export const getQuote = async (username, day) => {
    const res = await client.get(`social/daily/quote/@${username}/${day}/`)

    return res.data
}

export const postQuote = async (date, quote) => {
    const res = await client.post(`social/daily/quote/${date}/`, {
        content: quote,
    })

    return res.data
}

export const getDailyLogDetails = async (username, day, cursor) => {
    const res = await client.get(
        `social/daily/log/details/@${username}/${day}/?cursor=${cursor}`
    )

    return res.data
}

export const getDailyLogDrawers = async (username, cursor) => {
    const res = await client.get(
        `social/daily/log/details/drawer/@${username}/?cursor=${cursor}`,
    )

    return res.data
}

export const getDailyLogTasks = async (drawerID, day, page) => {
    const res = await client.get(
        `social/daily/log/details/task/${drawerID}/${day}/?page=${page}`,
    )

    return res.data
}

export const getExploreRecommend = async (cursor) => {
    const res = await client.get(`social/explore/?cursor=${cursor}`)

    return res.data
}

export const getExploreFound = async (query, cursor) => {
    const params = new URLSearchParams({ query: query, cursor: cursor })
    const res = await client.get(`social/explore/search/?${params.toString()}`)
    return res.data
}

export const getEmojis = async () => {
    const res = await client.get(`social/emojis/`)

    return res.data.results
}

export const getReactions = async (parentType, parentID) => {
    const res = await client.get(`social/reaction/${parentType}/${parentID}/`)

    return res.data
}

export const postReaction = async (parentType, parentID, emoji) => {
    const res = await client.post(
        `social/reaction/${parentType}/${parentID}/`,
        {
            emoji: emoji,
        },
    )

    return res.data
}

export const deleteReaction = async (parentType, parentID, emoji) => {
    const params = new URLSearchParams({ emoji: emoji })

    const res = await client.delete(
        `social/reaction/${parentType}/${parentID}/?${params.toString()}`,
    )

    return res.status
}

export const getPeck = async (taskID) => {
    const res = await client.get(`social/peck/${taskID}/`)

    return res.data
}

export const postPeck = async (taskID) => {
    const res = await client.post(`social/peck/${taskID}/`)

    return res.data
}

export const getComment = async (parentType, parentID) => {
    const res = await client.get(`social/comment/${parentType}/${parentID}/`)

    return res.data
}

export const postComment = async (parentType, parentID, comment) => {
    const res = await client.post(`social/comment/${parentType}/${parentID}/`, {
        comment: comment,
    })

    return res.data
}

export const patchComment = async (
    parentType,
    parentID,
    commentID,
    comment,
) => {
    const res = await client.patch(
        `social/comment/${parentType}/${parentID}/`,
        {
            id: commentID,
            comment: comment,
        },
    )
    return res.data
}

export const deleteComment = async (parentType, parentID, commentID) => {
    const res = await client.delete(
        `social/comment/${parentType}/${parentID}/`,
        {
            id: commentID,
        },
    )

    return res.status
}
