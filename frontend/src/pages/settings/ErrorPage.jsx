import Error from "@components/errors/ErrorLayout"
import { useTranslation } from "react-i18next"

const ErrorPage = () => {
    const { t } = useTranslation(null, {keyPrefix: "settings.error"})

    return <Error code={t("code")} text={t("text")} bottomText={t("bottom_text")} bottomLinkTo="/app/" />
}

export default ErrorPage
