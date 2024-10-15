import styled from "styled-components"

import FeatherIcon from "feather-icons-react"

const Detail = ({ title, children, onClose = () => {}, special = false }) => {
    return (
        <DetailBox $special={special}>
            <TitleBox>
                <Title>{title}</Title>
                <FeatherIcon icon="x" onClick={onClose} />
            </TitleBox>
            <CLine $special={special} />
            <Content>{children}</Content>
        </DetailBox>
    )
}

const DetailBox = styled.div`
    z-index: 999;
    width: ${(props) => (props.$special ? 18 : 15)}em;
    height: fit-content;
    max-height: 35em;
    overflow: hidden;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;
    padding-bottom: ${(props) => (props.$special ? "0" : "1")}em;
`

const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 1.3em;

    & svg {
        width: 1em;
        height: 1em;
        stroke: ${(p) => p.theme.primaryColors.danger};
        top: 1.2em;
        cursor: pointer;
    }
`

const Title = styled.div`
    font-weight: 550;
    font-size: 1em;
    color: ${(p) => p.theme.textColor};
    margin-top: 1.3em;
`

const CLine = styled.div`
    border-top: thin solid ${(p) => p.theme.project.lineColor};
    width: ${(props) => (props.$special ? "90%" : "85%")};
    margin: 1em 1em 0em;
`

const Content = styled.div`
    box-sizing: border-box;
    border-radius: 15px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 35em;
`

export default Detail
