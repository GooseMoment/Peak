import styled from "styled-components"

import next_week from "@assets/project/calendar/next_week.svg"
import today from "@assets/project/calendar/today.svg"
import tomorrow from "@assets/project/calendar/tomorrow.svg"
import slach from "@assets/project/slach.svg"

import { ifMobile } from "@utils/useScreenType"

import { useTranslation } from "react-i18next"

const QuickDue = ({ changeDueDate }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.due.quick" })

    const items = [
        { id: 0, icon: <img src={today} />, display: t("today"), set: { days: 0 }},
        { id: 1, icon: <img src={tomorrow} />, display: t("tomorrow"), set: { days: 1 }},
        {
            id: 2,
            icon: <img src={next_week} />,
            display: t("next_week"),
            set: { days: 7 },
        },
        {
            id: 3,
            icon: <img src={next_week} />,
            display: t("next_two_weeks"),
            set: { days: 14 },
        },
        {
            id: 4,
            icon: <img src={next_week} />,
            display: t("next_month"),
            set: { months: 1 },
        },
        { id: 5, icon: <img src={slach} />, display: t("no_date"), set: null },
    ]

    return (
        <ButtonFlexBox>
            {items.map((item) => (
                <ButtonBox key={item.id} onClick={changeDueDate(item.set)}>
                    {item.icon}
                    <DisplayText>{item.display}</DisplayText>
                </ButtonBox>
            ))}
        </ButtonFlexBox>
    )
}

const ButtonFlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 0.5em;
    margin-top: 1em;
    gap: 0.8em;

    ${ifMobile} {
        margin: 1em 0em;
    }
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.35em;
    width: 43%;
    height: 1.9em;
    border-radius: 15px;
    border: solid 1px ${(p) => p.theme.project.borderColor};
    color: ${(p) => p.theme.textColor};
    font-weight: normal;

    &:hover {
        color: ${(p) => p.theme.goose};
        font-weight: bold;
        cursor: pointer;
    }
`

const DisplayText = styled.div`
    text-align: center;
`

export default QuickDue
