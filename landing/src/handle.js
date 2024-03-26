import axios from 'axios'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

document.querySelector("#forgot-password").addEventListener("click", e => {
    Toastify({
        text: "This feature is in progress.\nIf you have a problem, please contact to support@peak.ooo.",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
    }).showToast()
})

const sectionSignIn = document.querySelector(".sign-in")
const sectionSignUp = document.querySelector(".sign-up")

document.querySelector("#create-account").addEventListener("click", e => {
    sectionSignIn.classList.add("hide")
    sectionSignUp.classList.remove("hide")

    document.title = "Sign up to Peak"
})

document.querySelector("#already-have").addEventListener("click", e => {
    sectionSignIn.classList.remove("hide")
    sectionSignUp.classList.add("hide")

    document.title = "Sign in to Peak"
})

axios.defaults.withCredentials = true
axios.defaults.baseURL = "https://api.peak.ooo/"

if (process.env.NODE_ENV === "development") {
    axios.defaults.baseURL = "http://localhost:8888/"
}

const newToast = (msg, level="success") => Toastify({
    text: msg,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: level,
})

document.querySelector("#form-sign-in").addEventListener("submit", e => {
    e.preventDefault()

    const button = e.target.querySelector(".submit-button")
    button.setAttribute("disabled", "true")
    button.innerHTML = "Please wait!"

    const data = new FormData(e.target);
    const email = data.get("email")
    const password = data.get("password")

    axios.post("sign_in/", {email, password}).then(res => {
        newToast("Signed in successfully.").showToast()

        setInterval(() => document.location = "/success_sign_in.html", 2000)
    }).catch(err => {
        if (err && err.code === "ERR_NETWORK") {
            newToast("Please check your network.", "error").showToast()
            return
        }
        newToast("Something's wrong. Please check your email and password!", "error").showToast()
    }).finally(() => {
        button.disabled = false
        button.innerHTML = "Go!"
    })
})

document.querySelector("#form-sign-up").addEventListener("submit", e => {
    e.preventDefault()

    const button = e.target.querySelector(".submit-button")
    button.setAttribute("disabled", "true")
    button.innerHTML = "Please wait!"

    const data = new FormData(e.target);
    const email = data.get("email")
    const password = data.get("password")
    const username = data.get("username")

    axios.post("sign_up/", {email, password, username}).then(res => {
        newToast("Welcome! You become a new member!").showToast()

        setInterval(() => document.location = "/success_sign_up.html", 2000)
    }).catch(err => {
        console.log(err)
        if (err && err.code === "ERR_NETWORK") {
            newToast("Please check your network.", "error").showToast()
            return
        } else if (err && err.response && err.response.status === 400) {
            let msg = ""
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
            newToast(msg, "error").showToast()
            return
        } else if (err && err.response && err.response.status === 500) {
            newToast("Something's wrong with our server. Please try later.", "error").showToast()
            return
        }

        newToast("Something's wrong. Please check your email and password!", "error").showToast()
    }).finally(() => {
        button.disabled = false
        button.innerHTML = "Let's start!"
    })
})