import { useEffect } from "react"
import { isRouteErrorResponse, useRouteError } from "react-router-dom"

import ErrorLayout from "@components/errors/ErrorLayout"

import { useTranslation } from "react-i18next"

const ErrorPage = () => {
    const error = useRouteError()
    const { t } = useTranslation(null, { keyPrefix: "error-page" })

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
