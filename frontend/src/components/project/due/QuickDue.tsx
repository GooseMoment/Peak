import styled from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import Slach from "@assets/project/Slach"
import next_week from "@assets/project/calendar/next_week.svg"
import today from "@assets/project/calendar/today.svg"
import tomorrow from "@assets/project/calendar/tomorrow.svg"

import { useTranslation } from "react-i18next"

const QuickDue = ({
    changeDueDate,
}: {
    changeDueDate: (
        set: { days: number } | { months: number } | null,
    ) => () => Promise<void>
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.due.quick" })

    const items = [
        {
            id: 0,
            icon: <img src={today} />,
            display: t("today"),
            set: { days: 0 } as const,
        },
        {
            id: 1,
            icon: <img src={tomorrow} />,
            display: t("tomorrow"),
            set: { days: 1 } as const,
        },
        {
            id: 2,
            icon: <img src={next_week} />,
            display: t("next_week"),
            set: { days: 7 } as const,
        },
        {
            id: 3,
            icon: <img src={next_week} />,
            display: t("next_two_weeks"),
            set: { days: 14 } as const,
        },
        {
            id: 4,
            icon: <img src={next_week} />,
            display: t("next_month"),
            set: { months: 1 } as const,
        },
        { id: 5, icon: <Slach />, display: t("no_date"), set: null },
    ]

    return (
        <ButtonFlexBox>
            {items.map((item) => (
                <ButtonBox
                    key={item.id}
                    onClick={
                        item.set === undefined
                            ? undefined
                            : changeDueDate(item.set)
                    }>
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
