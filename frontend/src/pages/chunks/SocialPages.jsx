import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import SocialExplorePage from "@pages/SocialExplorePage"
import SocialFollowingPage from "@pages/SocialFollowingPage"

const SocialRedirector = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate("/app/social/following", { replace: true })
    }, [])

    return null
}

export { SocialRedirector, SocialFollowingPage, SocialExplorePage }
