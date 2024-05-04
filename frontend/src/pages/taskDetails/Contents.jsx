import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"

import hourglass from "@assets/project/hourglass.svg"
import alarmclock from "@assets/project/alarmclock.svg"

import Calendar from "./Calendar"
import Assigned from "./Assigned"
import Reminder from "./Reminder"
import Priority from "./Priority"
import Drawer from "./Drawer"
import Memo from "./Memo"

import ToolTip from "@components/project/common/ToolTip"
import ModalPortal from "@components/common/ModalPortal"

const Contents = ({task, setFunc}) => {
    const { id: projectID } = useParams()
    const navigate = useNavigate()

    const [isComponentOpen, setIsComponentOpen] = useState(false)

    // text클릭 시 알맞는 component 띄우기
    const [content, setContent] = useState()
    
    const handleClickContent = (e) => {
        const name = Number(e.target.id)
        setContent(name)
        setIsComponentOpen(true)
    }

    const closeComponent = () => {
        setIsComponentOpen(false)
        navigate(`.`)
    }

    //display due, reminder
    const task_due = new Date(`${task.due_date}${task.due_time ? "T"+task.due_time : ""}`)
    const assigned_at_date = new Date(task.assigned_at)
    const reminder_date_time = new Date(task.reminder_datetime)
    const new_due_date = `${task_due.getFullYear()}년 ${task_due.getMonth()+1}월 ${task_due.getDate()}일`
    const new_due_time = `${task_due.getHours()}시 ${task_due.getMinutes()}분`
    const new_assigned_at_date = `${assigned_at_date.getFullYear()}년 ${assigned_at_date.getMonth()+1}월 ${assigned_at_date.getDate()}일`
    const new_reminder_datetime = `${reminder_date_time.getFullYear()}년 ${reminder_date_time.getMonth()+1}월 ${reminder_date_time.getDate()}일 ${reminder_date_time.getHours()}시 ${reminder_date_time.getMinutes()}분`

    const items = [
        {
            id: 1,
            name: "assigned_due",
            icon: <FeatherIcon icon="calendar" />,
            display: task.assigned_at ? new_assigned_at_date : "없음",
            component: <Assigned setFunc={setFunc} closeComponent={closeComponent}/>
        },
        {
            id: 2,
            name: "due",
            icon: <img src={hourglass} />,
            display: task.due_date && new_due_time ? new_due_date + ' ' + new_due_time : "없음",
            component: <Calendar setFunc={setFunc} closeComponent={closeComponent}/>
        },
        {
            id: 3,
            name: "reminder",
            icon: <img src={alarmclock} />,
            display: task.reminder_datetime ? new_reminder_datetime : "없음",
            component: <Reminder setFunc={setFunc} closeComponent={closeComponent}/>
            // 아직 안만듬
        },
        {
            id: 4,
            name: "priority",
            icon: <FeatherIcon icon="alert-circle" />,
            display: priorities[task.priority],
            component: <Priority setFunc={setFunc} closeComponent={closeComponent}/>
        },
        {
            id: 5,
            name: "drawer",
            icon: <FeatherIcon icon="archive" />,
            display: task.drawer_name ? `${task.project_name} / ${task.drawer_name}` : "없음",
            component: <Drawer projectID={projectID} task={task} setFunc={setFunc} closeComponent={closeComponent}/>
        },
        {
            id: 6,
            name: "memo",
            icon: <FeatherIcon icon="edit" />,
            display: task.memo ? task.memo : "없음",
            component: <Memo previousMemo={task.memo} setFunc={setFunc} closeComponent={closeComponent}/>
        },
    ]

    return (
        <ContentsBlock>
            {items.map(item => (
            <>
                <ContentsBox key={item.id}>
                    <ToolTip message={item.name}>
                        {item.icon}
                    </ToolTip>
                    <VLine $end={item.id === 1 || item.id === 6} />
                    <ContentText id={item.id} onClick={handleClickContent}>
                            {item.display}
                    </ContentText>
                    {(content === item.id && isComponentOpen) ? 
                    <ModalPortal closeModal={closeComponent} additional>
                        {item.component}
                    </ModalPortal> : null}
                </ContentsBox>
            </>
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

    & svg, img {
        width: 1.3em;
        height: 1.3em;
        stroke: #000000;
        margin-top: 1.3em;
        top: 0;
    }

    & img {
        margin-right: 8px;
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
    width: 31em;
    font-style: normal;
    font-size: 1.2em;
    color: #000000;
    margin-top: 1.1em;
    margin-left: 1.3em;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

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