import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Redirect = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        navigate("/app/settings/", {
            state: {
                previous: location?.state?.previous,
            }
        })
    }, [])

    return null
}

export default Redirect