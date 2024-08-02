import { useTranslation } from "react-i18next"
import styled from "styled-components"

import today from "@assets/project/calendar/today.svg"
import tomorrow from "@assets/project/calendar/tomorrow.svg"
import next_week from "@assets/project/calendar/next_week.svg"
import slach from "@assets/project/slach.svg"

const QuickDue = ({changeDueDate}) => {
    const { t } = useTranslation(null, {keyPrefix: "task.due.quick"})

    const items = [
        {id: 0, icon: <img src={today}/>, display: t("today"), set: 0},
        {id: 1, icon: <img src={tomorrow}/>, display: t("tomorrow"), set: 1},
        {id: 2, icon: <img src={next_week}/>, display: t("next_week"), set: 7},
        {id: 3, icon: <img src={next_week}/>, display: t("next_two_weeks"), set: 14},
        {id: 4, icon: <img src={next_week}/>, display: t("next_month"), set: 30},
        {id: 5, icon: <img src={slach}/>, display: t("no_date"), set: null},
    ]
    
    return (
        <ButtonFlexBox>
        {items.map(item=>(
            <ButtonBox key={item.id} onClick={changeDueDate(item.set)}>
                {item.icon}
                <DisplayText>{item.display}</DisplayText>
            </ButtonBox>))}
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
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4em;
    width: 40%;
    height: 2em;
    border-radius: 15px;
    border: solid 1px ${p => p.theme.project.borderColor};
    color: ${p => p.theme.textColor};
    font-weight: 500;

    &:hover {
        font-weight: bolder;
        color: ${p => p.theme.goose};
        cursor: pointer;
    }
`

const DisplayText = styled.div`
    text-align: center;
`

export default QuickDue