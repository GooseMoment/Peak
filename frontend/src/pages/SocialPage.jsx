import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const SocialPage = () => {
    const navigate = useNavigate()

    useEffect(()=> {
        navigate("/app/social/following", {replace: true})
    }, [])

    return null
}

export default SocialPage
