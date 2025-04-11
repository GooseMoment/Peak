import { useState } from "react"

import styled from "styled-components"

import PageTitle from "@components/common/PageTitle"
import ImportantTasks from "@components/today/ImportantTasks"
import TodayAssignmentTasks from "@components/today/TodayAssignmentTasks"
import TodayDateMenu from "@components/today/TodayDateMenu"

import { useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const TodayPage = () => {
    const { t } = useTranslation(null, { keyPrefix: "today" })
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)
    const [selectedDate, setSelectedDate] = useState(today.toISODate())

    const isToday = selectedDate === today.toISODate()
    const selected = DateTime.fromISO(selectedDate).setZone(tz)
    const weekdayName = selected.toFormat("ccc")

    const titleText = isToday ? t("title") : `${selectedDate} ${weekdayName}`

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
    padding-right: 1em;
`

export default TodayPage
