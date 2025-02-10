import { useState } from "react"

import styled from "styled-components"

import { useClientLocale } from "@utils/clientSettings"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const DateBar = ({ selectedDate, setSelectedDate }) => {
    const locale = useClientLocale()
    const { t } = useTranslation("", { keyPrefix: "social.date_bar" })

    const [date, setDate] = useState(
        selectedDate ? DateTime.fromISO(selectedDate) : DateTime.now(),
    )

    return <Frame>{date.setLocale(locale).toFormat(t("date_format"))}</Frame>
}

const Frame = styled.div``

export default DateBar
