import { useState } from "react"
import { Link, useParams } from "react-router-dom"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"

import Calendar from "./Calendar"
import Reminder from "./Reminder"
import Priority from "./Priority"
import Drawer from "./Drawer"
import Memo from "./Memo"

function Contents({task, setIsComponentOpen}) {
    const { id: projectId } = useParams()
    const pathRoot = `/app/projects/${projectId}/tasks/${task.id}/detail/`

    // text클릭 시 알맞는 component 띄우기
    const [content, setContent] = useState()
    
    const handleClickContent = (e) => {
        const name = e.target.id
        setContent(name)
        setIsComponentOpen(true)
    }

    //display due, reminder
    const task_due = new Date(`${task.due_date}${task.due_time ? "T"+task.due_time : ""}`)
    const reminder_date_time = new Date(task.reminder_datetime)
    const new_due_date = `${task_due.getFullYear()}년 ${task_due.getMonth()+1}월 ${task_due.getDate()}일`
    const new_due_time = `${task_due.getHours()}시 ${task_due.getMinutes()}분`
    const new_reminder_datetime = `${reminder_date_time.getFullYear()}년 ${reminder_date_time.getMonth()+1}월 ${reminder_date_time.getDate()}일 ${reminder_date_time.getHours()}시 ${reminder_date_time.getMinutes()}분`

    const items = [
        {
            id: 1,
            icon: "calendar",
            to: "due",
            display: task.due_date && new_due_time ? new_due_date + ' ' + new_due_time : "없음",
            component: <Calendar />
        },
        {
            id: 2,
            icon: "clock",
            to: "reminder",
            display: task.reminder_datetime ? new_reminder_datetime : "없음",
            component: <Reminder task={task} />
        },
        {
            id: 3,
            icon: "alert-circle",
            to: "priority",
            display: priorities[task.priority],
            component: <Priority />
        },
        {
            id: 4,
            icon: "archive",
            to: "drawer",
            display: task.drawer_name ? `${task.project_name} / ${task.drawer_name}` : "없음",
            component: <Drawer projectId={projectId} task={task} />
        },
        {
            id: 5,
            icon: "edit",
            to: "memo",
            display: task.memo ? task.memo : "없음",
            component: <Memo />
        },
    ]

    return (
        <ContentsBlock>
            {items.map(item => (
            <ContentsBox key={item.id}>
                <FeatherIcon icon={item.icon} />
                <VLine $end={item.id === 1 || item.id === 5} />
                <Link to={pathRoot+item.to} style={{ textDecoration: 'none' }}>
                    <ContentText id ={item.icon} onClick={handleClickContent}>
                        {item.display}
                    </ContentText>
                </Link>
            </ContentsBox>
            ))}
        </ContentsBlock>
    )
}


const ContentsBlock = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 3.8em;
`

const ContentsBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & svg {
        width: 1.3em;
        height: 1.3em;
        stroke: #000000;
        margin-top: 1.3em;
        top: 0;
    }
`

const VLine = styled.div`
    border-left: thin solid #D9D9D9;
    height: 1em;
    margin-top: 1.3em;
    margin-left: 1em;
    transform: scale(1, 5);

    ${({$end}) => $end ? css`
        transform: scale(1, 1.2);
    ` : null}
`

const ContentText = styled.div`
    font-style: normal;
    font-size: 1.2em;
    color: #000000;
    margin-top: 1.1em;
    margin-left: 1.3em;
    text-decoration: none;

    &:hover {
    cursor: pointer;
    }
`

const priorities = [
    '보통',
    '중요',
    '매우 중요'
]

export default Contents