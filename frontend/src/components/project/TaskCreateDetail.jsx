import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';
import { useState } from "react";

import TaskName from "./TaskName";
import CalendarDetail from "./CreateDetail/CalendarDetail";
import ReminderDetail from "./CreateDetail/ReminderDetail";
import PriorityDetail from "./CreateDetail/PriorityDetail";
import DrawerDetail from "./CreateDetail/DrawerDetail";
import Memo from "./CreateDetail/Memo";
import ModalPortal from "./ModalPortal";

function TaskCreateDetail({task, onClose}) {
    // text클릭 시 알맞는 component 띄우기
    const [content, setContent] = useState();

    const handleClickContent = (e) => {
        const name = e.target.id;
        setContent(name);
    };

    return (
        <ModalPortal>
            <ModalBackdrop>
                <TaskCreateDetailBox>
                    <TaskNameBox>
                        <TaskName task={task} />
                        <FeatherIcon icon="x" onClick={onClose} />
                    </TaskNameBox>
                    <ContentsBlock>
                        {items.map(item => (
                        <ContentsBox>
                            <FeatherIcon icon={item.icon} />
                            <VLine />
                            <ContentText id ={item.name} onClick={handleClickContent}>
                                {content === item.name || item.content}
                            </ContentText>
                            {content === item.name && <div>{item.component}</div>}
                        </ContentsBox>
                        ))}
                    </ContentsBlock>
                </TaskCreateDetailBox>
            </ModalBackdrop>
        </ModalPortal>
    )
}

const TaskCreateDetailBox = styled.div`
    z-index: 9999;
    width: 50em;
    height: 20em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const TaskNameBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1em 1.8em;

    & svg:nth-child(2) {
        stroke: #FF0000;
    }
`

const ContentsBlock = styled.div`
    flex: 1;
    display: flex;
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
    transform: scale(1, 2.75);

    & div:nth-child(1) {
        transform: scale(1, 1);
    }
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

const ModalBackdrop = styled.div`
    z-index: 1;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.4);
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
`

const items = [
    {id: 1, icon: "calendar", name: "Calendar", content: "2024년 02월 20일 18:00", component: <CalendarDetail />},
    {id: 2, icon: "clock", name: "Clock", content: "2024년 02월 20일 16:00", component: <ReminderDetail />},
    {id: 3, icon: "alert-circle", name: "Alert-circle", content: "매우 중요", component: <PriorityDetail /> },
    {id: 4, icon: "archive", name: "Archive", content: "홍대라이프 / 수강신청", component: <DrawerDetail /> },
    {id: 5, icon: "edit", name: "Edit", content: "없음", component: <Memo />},
]

export default TaskCreateDetail