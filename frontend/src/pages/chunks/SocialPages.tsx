import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import SocialDailyPage from "@pages/SocialDailyPage"
import SocialExplorePage from "@pages/SocialExplorePage"
import SocialFollowingPage from "@pages/SocialFollowingPage"

const SocialRedirector = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate("/app/social/following", { replace: true })
    }, [navigate])

    return null
}

export {
    SocialRedirector,
    SocialFollowingPage,
    SocialExplorePage,
    SocialDailyPage,
}
