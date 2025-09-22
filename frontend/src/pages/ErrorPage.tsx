import { Link, useNavigate, useRouteError } from "react-router-dom"

import MildButton from "@components/common/MildButton"
import ErrorLayout from "@components/errors/ErrorLayout"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"

interface ErrorPageProp {
    is404?: boolean
}

const ErrorPage = ({ is404 = false }: ErrorPageProp) => {
    const error = useRouteError() as Error
    const { t } = useTranslation("translation", { keyPrefix: "error-page" })
    const navigate = useNavigate()

    const handleClearCache = () => {
        // use native confirm dialog just case of toast not working
        if (confirm(t("clear_cache_confirm"))) {
            queryClient.clear()
            document.location.reload()
        }
    }

    if (is404) {
        return (
            <ErrorLayout code="404" text={t("404_error_text")}>
                <MildButton onClick={() => navigate(-1)}>
                    {t("404_error_bottom")}
                </MildButton>
            </ErrorLayout>
        )
    }

    return (
        <ErrorLayout
            code={t("unknown_error_code")}
            text={t("unknown_error_text")}
            error={error}>
            <Link reloadDocument to="/app/">
                {t("unknown_error_bottom")}
            </Link>
            <MildButton onClick={handleClearCache}>
                {t("clear_cache")}
            </MildButton>
        </ErrorLayout>
    )
}

export default ErrorPage
