import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const ErrorPage = () => {
    const navigate = useNavigate()
    toast.error("Error on Settings. Please try again.", {toastId: "errorSettings"})

    useEffect(() => {
        navigate("/")
    }, [])

    return null
}

export default ErrorPage
