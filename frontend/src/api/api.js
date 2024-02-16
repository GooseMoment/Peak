const getCurrentUser = () => {
}

// Today

const getTodayTasks = (userID) => {
}

// Projects

const getProjectsList = (userID) => {

}

const getProject = (id) => {

}

const postProject = (project) => {

}

const patchProject = (id, project) => {

}

const deleteProject = (id) => {

}

const getDrawersByProject = (project_id) => {

}

const getDrawer = (id) => {

}

const postDrawer = (drawer) => {

}

const patchDrawer = (id, drawer) => {

}

const deleteDrawer = (id) => {

}

const getTasksByDrawer = (drawerID) => {

}

const getTask = (id, isReactionIncluded) => {

}

const postTask = (task) => {

}

const patchTask = (id, task) => {

}

const deleteTask = (id) => {

}

const completeTask = (id) => {

}

// Notifications

const getNotifications = (userID, fromID) => {

}

const getNotification = (id) => {

}

const deleteNotification = (id) => {

}

// Social

// send (user: sender)
// userID: receiver
const postFollowRequest = (userID) => {

}

// accept or reject (user: receiver)
// userID: sender
const patchFollowRequest = (userID) => {

}

// cancel (user: sender)
// userID: receiver
const deleteFollowRequest = (userID) => {

}

const getUserByID = (userID) => {

}

const getUserByUsername = (username) => {

}

const getFollowers = (userID) => {

}

const getFollowings = (userID) => {

}

const getBlocks = () => {

}

const postBlock = (userID) => {

}

const deleteBlock = (userID) => {

}

const getDailyReport = (userID, date) => {

}

const getFollowingFeed = (date) => {

}

const getExploreFeed = (userID) => {

}

const getEmojis = () => {

}

const postReaction = (taskID, emoji) => {

}

const deleteReaction = (taskID) => {

}

const postCommentToTask = (taskID, comment) => {

}

const postCommentToDailyComment = (date, comment) => {

}

const postPeck = (taskID) => {

}

// Settings

const patchUser = (user) => {

}

const getSettings = (userID) => {

}

// TODO: search 