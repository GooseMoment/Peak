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
    try {
        await axios.post("sign_in/", {
            email: email,
            password: password,
        })
    } catch (e) {
        return false
    }

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