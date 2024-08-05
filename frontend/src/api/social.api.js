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

    try {
        const res = await client.put(`social/follow/@${follower}/@${followee}/`)
        if (res.status === 208) {
            throw new Error("Following already exists.")
        }

        return res.data
    } catch (e) {
        throw e
    }
}

// accept or reject (user: receiver)
// username: sender's
export const patchFollowRequest = async (username, accept) => {
    const follower = username
    const followee = getCurrentUsername()

    try {
        const res = await client.patch(`social/follow/@${follower}/@${followee}/`, {
            status: accept ? "accepted" : "rejected",
        })

        return res.data
    } catch (e) {
        throw e
    }
}

// cancel (user: sender)
// username: receiver's
export const deleteFollowRequest = async (username) => {
    const follower = getCurrentUsername()
    const followee = username

    try {
        const res = await client.delete(`social/follow/@${follower}/@${followee}/`)

        return res.data
    } catch (e) {
        throw e
    }
}

export const getFollowersByUser = async (username) => {
    try {
        const res = await client.get(`users/@${username}/followers/`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const getFollowingsByUser = async (username) => {
    try {
        const res = await client.get(`users/@${username}/followings/`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const getBlocks = () => {

}

export const postBlock = (userID) => {

}

export const deleteBlock = (userID) => {

}

export const getDailyLogsPreview = async(username, day) => {
    try {
        const res = await client.get(`social/daily/logs/@${username}/${day}/`)
        return res.data
    } catch(e) {
        throw e
    }
}

export const getDailyComment = async(username, day) => {
    try {
        const res = await client.get(`social/daily/comment/@${username}/${day}/`)
        return res.data
    } catch(e) {
        throw e
    }
}

export const getDailyLogDetails = async(username, day) => {
    try {
        const res = await client.get(`social/daily/log/details/@${username}/${day}/`)
        return res.data
    } catch(e) {
        throw e
    }
}

export const getFollowingFeed = (date) => {

}

export const getExploreFeed = (userID) => {

}

export const getEmojis = async () => {
    try {
        const res = await client.get(`social/emojis/`)
        return res.data.results
    } catch (e) {
        throw e
    }
}

export const getReactions = async(contentType, contentID) => {
    try {
        const res = await client.get(`social/reaction/${contentType}/${contentID}/`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const postReaction = async(contentType, contentID, emoji) => {
    try {
        const res = await client.post(`social/reaction/${contentType}/${contentID}/`, {
            emoji: emoji
        })
        return res.data
    } catch(e) {
        throw e
    }
}

export const deleteReaction = async(contentType, contentID, emoji) => {
    const params = new URLSearchParams({emoji: emoji})

    try {
        const res = await client.delete(`social/reaction/${contentType}/${contentID}/?${params.toString()}`)
        return res.status
    } catch(e) {
        throw e
    }
}

export const getPeck = async(taskID) => {
    try {
        const res = await client.get(`social/peck/${taskID}/`)
        return res.data
    } catch(e) {
        throw(e)
    }
}

export const postPeck = async(taskID) => {
    try {
        const res = await client.post(`social/peck/${taskID}/`)
        return res.data
    } catch(e) {
        throw(e)
    }
}

export const postCommentToTask = (taskID, comment) => {

}

export const postDailyComment = async(date, dailycomment) => {
    try {
        const res = await client.post(`social/daily/comment/${date}/`, {
            content: dailycomment
        })
        return res.data
    } catch (e) {
        throw e
    }
}