import axios from "axios"

export const getCurrentUser = async () => {
    try {
        const res = await axios.get("current_user/")
        return res.data
    } catch (e) {
        throw e
    }
}

export const getUserByID = (userID) => {

}

export const getUserByUsername = (username) => {

}

export const patchUser = (user) => {

}

export const signIn = async (email, password) => {
    return await axios.post("sign_in/", {
        email: email,
        password: password,
    })
}