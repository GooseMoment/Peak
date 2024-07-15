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

}

export const getFollowingsByUser = async (username) => {

}

export const getBlocks = () => {

}

export const postBlock = (userID) => {

}

export const deleteBlock = (userID) => {

}

export const getDailyReport = async(username, day) => {
    try {
        const res = await client.get(`social/daily/logs/@${username}/${day}/`)
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

export const postReaction = (taskID, emoji) => {

}

export const deleteReaction = (taskID) => {

}

export const postCommentToTask = (taskID, comment) => {

}

export const postCommentToDailyComment = (date, comment) => {

}

export const postPeck = (taskID) => {

}
