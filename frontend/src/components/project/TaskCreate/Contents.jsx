import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"
import { useState } from "react"

import ModalPortal from "../ModalPortal"
import Calendar from "./Calendar"
import Reminder from "./Reminder"
import Priority from "./Priority"
import Drawer from "./Drawer"
import Memo from "./Memo"

function Contents() {
    const [isComponentOpen, setIsComponentOpen] = useState(false);
    // text클릭 시 알맞는 component 띄우기
    const [content, setContent] = useState();

    const onClose = () => {
        setIsComponentOpen(false);
    }

    const handleClickContent = (e) => {
        setIsComponentOpen(true);
        const name = e.target.id;
        setContent(name);
    };
    
    return (
        <ContentsBlock>
            {items.map(item => (
            <ContentsBox key={item.id}>
                <FeatherIcon icon={item.icon} />
                <VLine $end={item.id === 1 || item.id === 5} />
                <ContentText id ={item.icon} onClick={handleClickContent}>
                    {content === item.icon || item.content}
                </ContentText>
                {(content === item.icon && isComponentOpen) ? 
                <ModalPortal>
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

const items = [
    {id: 1,
    icon: "calendar",
    content: "2024년 02월 20일 18:00",
    component: <Calendar/>},

    {id: 2,
    icon: "clock",
    content: "2024년 02월 20일 16:00",
    component: <Reminder/>},

    {id: 3,
    icon: "alert-circle",
    content: "매우 중요",
    component: <Priority/>},

    {id: 4,
    icon: "archive",
    content: "홍대라이프 / 수강신청",
    component: <Drawer/>},

    {id: 5,
    icon: "edit",
    content: "없음",
    component: <Memo/>},
]

export default Contents