import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';

import TaskName from "./TaskName";

const TaskCreateDetailBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const TaskCreateDetailBox = styled.div`
    width: 50em;
    height: 20em;
    background-color: #FFFFFF;
    border: solid 3px #D9D9D9;
    border-radius: 15px;
`

const TaskNameBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.5em 1.2em;

    & .feather {
        stroke: #FF0000;
    }
`
const ContentsBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 3.1em;
`

const IconBox = styled.div`
    display: flex;
    flex-direction: column;

    & .feather {
        width: 1.3em;
        height: 1.3em;
        stroke: #000000;
        margin-top: 1.3em;
    }
`

const VLine = styled.div`
    border-left: thin solid #D9D9D9;
    height: 12.2em;
    margin-top: 1.3em;
    margin-left: 1em;
`

const TextBox = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 1em;
    font-style: normal;
    font-size: 1.3em;
    color: #000000;

    & .div {
        margin-top: 1em;
    }
`

function TaskCreateDetail() {
    return (
        <TaskCreateDetailBlock>
            <TaskCreateDetailBox>
                <TaskNameBox>
                    <TaskName text="시간표 짜기" />
                    <FeatherIcon icon="trash-2" />
                </TaskNameBox>
                <ContentsBox>
                    <IconBox>
                        <FeatherIcon icon="calendar" />
                        <FeatherIcon icon="clock" />
                        <FeatherIcon icon="alert-circle" />
                        <FeatherIcon icon="archive" />
                        <FeatherIcon icon="edit" />
                    </IconBox>
                    <VLine />
                    <TextBox>
                        <div>2024년 02월 20일 18:00</div>
                        <div>2024년 02월 20일 16:00</div>
                        <div>매우 중요</div>
                        <div>홍대라이프 / 수강신청</div>
                        <div>없음</div>
                    </TextBox>
                </ContentsBox>
            </TaskCreateDetailBox>
        </TaskCreateDetailBlock>
    )
}

export default TaskCreateDetail