import client from "@api/client"

export const getMe = async () => {
    try {
        const res = await client.get("users/me")
        return res.data
    } catch (e) {
        throw e
    }
}

export const getUserByUsername = async (username) => {
    try {
        const res = await client.get(`users/@${username}/`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const patchUser = async (data) => {
    try {
        const me = await getMe()
        const res = await client.patch(`users/@${me.username}/`, data)
        return res.status
    } catch (e) {
        throw e
    }
}

const KEY_IS_SIGNED_IN = "is_signed_in"
const VALUE_IS_SIGNED_IN = "yeah"

export const isSignedIn = () => {
    return localStorage.getItem(KEY_IS_SIGNED_IN) === VALUE_IS_SIGNED_IN ? true : false
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

    localStorage.setItem(KEY_IS_SIGNED_IN, VALUE_IS_SIGNED_IN)
    return true
}

export const signUp = async (email, password, username) => {
    try {
        const res = await axios.post("sign_up/", {email, password, username})
        return res
    } catch (err) {
        let msg = ""
        if (err && err.code === "ERR_NETWORK") {
            msg = "Please check your network."
        } else if (err && err.response && err.response.status === 400) {
            switch (err.response.data.code) {
                case 'SIGNUP_SIGNED_IN_USER':
                    msg = "You already signed in! Please go back to your app."
                    break
                case 'SIGNUP_USERNAME_TOO_SHORT':
                    msg = "username should be more than 4 characters."
                    break
                case 'SIGNUP_PASSWORD_TOO_SHORT':
                    msg = "You already signed in! Please go back to your app."
                    break
                case 'SIGNUP_USERNAME_WRONG':
                    msg = "username should only contain alphabets, underscore, and digits."
                    break
            }
        } else if (err && err.response && err.response.status === 500) {
            msg = "Something's wrong with our server. Please try later."
            return
        } else {
            throw err
        }

        throw new Error(msg)
    }
}