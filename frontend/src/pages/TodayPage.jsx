import PageTitle from "@components/common/PageTitle"
import ImportantTasks from "@components/today/ImportantTasks"
import TodayAssignmentTasks from "@components/today/TodayAssignmentTasks"

import { useTranslation } from "react-i18next"

const TodayPage = () => {
    const { t } = useTranslation(null, { keyPrefix: "today" })

    return (
        <>
            <PageTitle>{t("title")}</PageTitle>
            <ImportantTasks />
            <TodayAssignmentTasks />
        </>
    )
}

export default TodayPage
