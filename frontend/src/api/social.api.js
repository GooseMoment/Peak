import client from "@api/client"

// send (user: sender)
// userID: receiver
export const postFollowRequest = (userID) => {

}

// accept or reject (user: receiver)
// userID: sender
export const patchFollowRequest = (userID) => {

}

// cancel (user: sender)
// userID: receiver
export const deleteFollowRequest = (userID) => {

}

export const getFollowers = (userID) => {

}

export const getFollowings = (userID) => {

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

export const postCommentToDailyComment = async(date, dailycomment) => {
    try {
        const res = await client.post(`social/daily/comment/${date}`, {
            comment: dailycomment
        })
        return res.status
    } catch (e) {
        throw e
    }
}

export const postPeck = (taskID) => {

}
