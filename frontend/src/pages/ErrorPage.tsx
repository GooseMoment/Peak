import { Link, useRouteError } from "react-router-dom"

import ErrorLayout from "@components/errors/ErrorLayout"

import { useTranslation } from "react-i18next"

interface ErrorPageProp {
    is404?: boolean
}

const ErrorPage = ({ is404 = false }: ErrorPageProp) => {
    const error = useRouteError() as Error
    const { t } = useTranslation("translation", { keyPrefix: "error-page" })

    if (is404) {
        return (
            <ErrorLayout code="404" text={t("404_error_text")}>
                <Link to="..">{t("404_error_bottom")}</Link>
            </ErrorLayout>
        )
    }

    return (
        <ErrorLayout
            code={t("unknown_error_code")}
            text={t("unknown_error_text")}
            error={error}>
            <Link reloadDocument to="/app/home/">
                {t("unknown_error_bottom")}
            </Link>
        </ErrorLayout>
    )
}

export default ErrorPage
