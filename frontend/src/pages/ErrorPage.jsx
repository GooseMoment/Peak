import { useEffect } from "react"
import {
    isRouteErrorResponse,
    useNavigate,
    useRouteError,
} from "react-router-dom"

import ErrorLayout from "@components/errors/ErrorLayout"

import { setToken } from "@api/client"
import { useTranslation } from "react-i18next"

const ErrorPage = () => {
    const error = useRouteError()
    const navigate = useNavigate()
    const { t } = useTranslation(null, { keyPrefix: "error-page" })

    useEffect(() => {
        if (isRouteErrorResponse(error) && error.status === 401) {
            setToken(null)
            navigate("/sign?flag=401")
        }
    }, [])

    useEffect(() => {
        if (import.meta.env.DEBUG == 1) {
            console.log(error)
        }
    }, [error])

    if (isRouteErrorResponse(error)) {
        return (
            <ErrorLayout
                code={"" + error.status}
                text={t("404_error_text")}
                bottomText={t("404_error_bottom")}
                bottomLinkTo=".."
            />
        )
    }

    return (
        <ErrorLayout
            code={t("unknown_error_code")}
            text={t("unknown_error_text")}
            bottomText={t("unknown_error_bottom")}
            bottomLinkTo="/app/"
        />
    )
}

export default ErrorPage
