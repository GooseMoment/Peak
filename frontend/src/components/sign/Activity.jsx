import styled from "styled-components"

// Activity: 구 landing/sign.html의 log
const Activity = ({action, detail, ago}) => {
    return (
        <ActivityBox>
            <Content>
                <Action>{action}:</Action> <Detail>{detail}</Detail>
            </Content>
            <Ago>{ago}</Ago>
        </ActivityBox>
    )
}


const ActivityBox = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    font-size: 1.5rem;
`

// Content: 구 landing/sign.html의 log.activity
const Content = styled.p`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const Action = styled.span`
    font-weight: 700;
`

// Detail: 구 landing/sign.html의 log.activity.content
const Detail = styled.span`
    margin-left: 0.25rem;
    font-weight: 400;
`

const Ago = styled.p`
    font-weight: 300;
    font-size: 0.75rem;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

export default Activity