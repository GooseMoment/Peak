import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { getClientSettings } from "@utils/clientSettings"

const startpage = getClientSettings()["startpage"]

const StartPage = () => {
    const navigate = useNavigate()

    let to = ""
    if (startpage === "home" || startpage === "today") {
        to = startpage
    } else {
        to = "home"
    }

    useEffect(() => {
        navigate("/app/" + to, { replace: true })
    }, [navigate, to])

    return null
}

export default StartPage
