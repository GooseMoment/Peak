import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const SocialPage =()=> {
    const navigate = useNavigate()

    useEffect(()=> {
        navigate("social/following")
    })
}

export default SocialPage