import client from "@/api/client"

export const getMe = async () => {
    try {
        const res = await client.get("users/me")
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
    try {
        await client.post("sign_in/", {
            email: email,
            password: password,
        })
    } catch (e) {
        return false
    }

    return true
}