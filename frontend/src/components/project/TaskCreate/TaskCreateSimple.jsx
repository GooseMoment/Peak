import FeatherIcon from "feather-icons-react";  
import styled, { css } from "styled-components";
import { useState } from "react";

const TaskCreateSimple = () => {
    const [tab, setTab] = useState(0);

    const tabClick = (index) => {
        setTab(index)
    }

    return (
        <>
            <FlexBox>
                {items.map((val, index) => {
                    return (
                        <IndexBox
                        $active={tab === index}
                        key={val.id}
                        onClick={() => tabClick(index)}
                        >
                            <FeatherIcon icon={val.icon}/>
                        </IndexBox>
                )})}
            </FlexBox>
            <FieldBox>
                <p>{items[tab].content}</p>
            </FieldBox>
        </>
    )
}

const FlexBox = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-left: 10px;
`

const IndexBox = styled.div`
    z-index: 1;
    position: relative;
    width: 2.3em;
    height: 2em;
    background-color: #FFFFFF;
    border: solid 2px #D9D9D9;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    cursor: pointer;
    justify-content: center;
    text-align: center;
    margin-left: 5px;
    border-bottom: none;
    
    ${(props) =>
        props.$active && css`
        background-color: #FF4A03;
        border: solid 2px #FFD7D7;
        border-bottom: none;

        & svg {
            stroke: #FFFFFF;
        }`
    }

    & svg {
        width: 1.1em;
        height: 1.1em;
        margin-top: 6px;
        margin-left: 8px;
    }
`

const FieldBox = styled.div`
    z-index: 2;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 3.8em;
    background-color: #FFFFFF;
    border: solid 2px #D9D9D9;
    border-radius: 15px;
    margin-bottom: none;
`

const items = [
    {id: 0, icon: "tag", name: "Tag", content: "추가할 이름"},
    {id: 1, icon: "calendar", name: "Calendar", content: "2024년 02월 20일 18:00"},
    {id: 2, icon: "clock", name: "Clock", content: "2024년 02월 20일 16:00"},
    {id: 3, icon: "alert-circle", name: "Alert-circle", content: "매우 중요"},
    {id: 4, icon: "archive", name: "Archive", content: "홍대라이프 / 수강신청"},
    {id: 5, icon: "edit", name: "Edit", content: "없음"},
]

export default TaskCreateSimple