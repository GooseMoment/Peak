import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"
import { useState } from "react"

import ModalPortal from "@components/common/ModalPortal"
import Calendar from "./Calendar"
import Reminder from "./Reminder"
import Priority from "./Priority"
import Drawer from "./Drawer"
import Memo from "./Memo"

function Contents({task, setTasks}) {
    // text클릭 시 알맞는 component 띄우기
    const [content, setContent] = useState()
    
    const handleClickContent = (e) => {
        setIsComponentOpen(true);
        const name = e.target.id;
        setContent(name);
    }

    // component modal
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const onClose = () => {
        setIsComponentOpen(false);
    }

    const task_due = new Date(`${task.due_date}${task.due_time ? "T"+task.due_time : ""}`)
    const reminder_date_time = new Date(task.reminder_datetime)
    const new_due_date = `${task_due.getFullYear()}년 ${task_due.getMonth()+1}월 ${task_due.getDate()}일`
    const new_due_time = `${task_due.getHours()}시 ${task_due.getMinutes()}분`
    const new_reminder_datetime = `${reminder_date_time.getFullYear()}년 ${reminder_date_time.getMonth()+1}월 ${reminder_date_time.getDate()}일 ${reminder_date_time.getHours()}시 ${reminder_date_time.getMinutes()}분`

    const items = [
        {id: 1,
        icon: "calendar",
        content: task.due_date && new_due_time ? new_due_date + ' ' + new_due_time : "없음",
        component: <Calendar taskId={task.id} setTasks={setTasks} onClose={onClose} />},
    
        {id: 2,
        icon: "clock",
        content: task.reminder_datetime ? new_reminder_datetime : "없음",
        component: <Reminder task={task} setTasks={setTasks} onClose={onClose} />},
    
        {id: 3,
        icon: "alert-circle",
        content: priorities[task.priority],
        component: <Priority taskId={task.id} setTasks={setTasks} onClose={onClose} />},
    
        {id: 4,
        icon: "archive",
        content: task.drawer_name ? `${task.project_name} / ${task.drawer_name}` : "없음",
        component: <Drawer taskId={task.id} setTasks={setTasks} onClose={onClose} />},
    
        {id: 5,
        icon: "edit",
        content: task.memo ? task.memo : "없음",
        component: <Memo taskId={task.id} setTasks={setTasks} onClose={onClose} />},
    ]
    
    return (
        <ContentsBlock>
            {items.map(item => (
            <ContentsBox key={item.id}>
                <FeatherIcon icon={item.icon} />
                <VLine $end={item.id === 1 || item.id === 5} />
                <ContentText id ={item.icon} onClick={handleClickContent}>
                    {item.content}
                </ContentText>
                {(content === item.icon && isComponentOpen) ? 
                <ModalPortal closeModal={onClose} additional>
                    {item.component}
                </ModalPortal> : null}
            </ContentsBox>
            ))}
        </ContentsBlock>
    )
}


const ContentsBlock = styled.div`
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 3.1em;
    margin-top: 1em;
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