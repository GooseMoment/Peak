import axios from 'axios'

document.querySelector("#forgot-password").addEventListener("click", e => {
    alert("아직 준비 중입니다.")
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

document.querySelector("#form-sign-in").addEventListener("submit", e => {
    e.preventDefault()
    const data = new FormData(e.target);
    const email = data.get("email")
    const password = data.get("password")

    axios.post("http://localhost:8000/sign_in/", {
        "email": email,
        "password": password,
    }).then(res => {
        alert("success")
    }).catch(err => {
        console.log(err)
        alert(err)
    })
})