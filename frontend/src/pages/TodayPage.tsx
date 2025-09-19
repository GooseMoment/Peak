import { useState } from "react"

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

    const today = DateTime.now().setZone(tz)
    const [selectedDate, setSelectedDate] = useState<string>(today.toISODate()!)

    const isToday = selectedDate === today.toISODate()
    const selectedDateTime = DateTime.fromISO(selectedDate).setZone(tz)

    const titleText = isToday
        ? t("title")
        : selectedDateTime.setLocale(locale).toLocaleString({
              weekday: "short",
              month: "short",
              day: "numeric",
          })

    return (
        <>
            <TitleBox>
                <PageTitle>{titleText}</PageTitle>
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
