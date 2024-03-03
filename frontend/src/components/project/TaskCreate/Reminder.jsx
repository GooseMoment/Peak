import FeatherIcon from "feather-icons-react"
import styled from "styled-components"
import ModalPortal from "../ModalPortal"

const Reminder = () => {
    return (
        <ModalPortal>
            <ReminderBox>
                <TitleBox>
                    <Title>알림 설정</Title>
                    <FeatherIcon icon="x"/>
                </TitleBox>
                <CLine />
                {items.map(item => (
                    <ItemBlock>
                        <FeatherIcon icon={item.icon} />
                        <ItemText>{item.content}</ItemText>
                    </ItemBlock>
                ))}
            </ReminderBox>
        </ModalPortal>
    )
}

const ReminderBox = styled.div`
    width: 15em;
    height: 23.5em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
`

const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 1.3em;

    & svg {
        width: 1em;
        height: 1em;
        stroke: #FF0000;
        top: 0;
    }
`

const Title = styled.div`
    font-style: normal;
    font-size: 1em;
    color: #000000;
    margin-top: 1.3em;
`

const CLine = styled.div`
    border-top: thin solid #D9D9D9;
    width: 12.5em;
    margin-top: 1em;
    margin-bottom: 0.3em;
    margin-left: 1em;
`

const ItemBlock = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-left: 1.2em;

    & svg {
        stroke: #FF4A03;
        margin-top: 1em;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: #000000;
    margin-top: 1.3em;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;
    }
`

const items = [
    {id: 0, icon: "clock", content: "5분 전"},
    {id: 1, icon: "clock", content: "15분 전"},
    {id: 2, icon: "clock", content: "30분 전"},
    {id: 3, icon: "clock", content: "1시간 전"},
    {id: 4, icon: "clock", content: "당일"},
    {id: 5, icon: "clock", content: "1일 전"},
    {id: 6, icon: "clock", content: "2일 전"},
    {id: 7, icon: "clock", content: "사용자 지정"},
]

export default Reminder