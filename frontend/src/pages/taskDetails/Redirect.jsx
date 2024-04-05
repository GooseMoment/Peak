import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Redirect = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        navigate("/app/projects/id/taskCreates/")
    })
}