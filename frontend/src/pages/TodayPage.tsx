import { useMemo, useState } from "react"

import styled from "styled-components"

import PageTitle from "@components/common/PageTitle"
import ImportantTasks from "@components/today/ImportantTasks"
import TodayAssignmentTasks from "@components/today/TodayAssignmentTasks"
import TodayDateMenu from "@components/today/TodayDateMenu"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const TodayPage = () => {
    const { t } = useTranslation("translation", { keyPrefix: "today" })

    const tz = useClientTimezone()
    const locale = useClientLocale()

    const [selectedDate, setSelectedDate] = useState(() =>
        DateTime.now().setZone(tz).startOf("day"),
    )

    const title = useMemo(() => {
        const now = DateTime.now().setZone(tz)
        if (selectedDate.hasSame(now, "day")) {
            return t("title")
        }
        return selectedDate.setLocale(locale).toLocaleString({
            year: selectedDate.hasSame(now, "year") ? undefined : "numeric",
            weekday: "short",
            month: "short",
            day: "numeric",
        })
    }, [selectedDate, t, locale, tz])

    return (
        <>
            <TitleBox>
                <PageTitle>{title}</PageTitle>
                <TodayDateMenu
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </TitleBox>
            <ImportantTasks />
            <TodayAssignmentTasks selectedDate={selectedDate} />
        </>
    )
}

const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export default TodayPage
