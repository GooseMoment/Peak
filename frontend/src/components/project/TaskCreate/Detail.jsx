import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

import ModalPortal from "../ModalPortal"

const Detail = ({title, children}) => {
    return (
        <ModalPortal>
            <DetailBox>
                <TitleBox>
                    <Title>{title}</Title>
                    <FeatherIcon icon="x"/>
                </TitleBox>
                <CLine />
                {children}
            </DetailBox>
        </ModalPortal>
    )
}

const DetailBox = styled.div`
    z-index: 999;
    position: absolute;
    width: 15em;
    height: auto;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
    top: 50%;
    left: 30%;
`

const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 1.3em;

    & svg {
        width: 1em;
        height: 1em;
        stroke: #FF0000;
        top: 1.2em;
        cursor: pointer;
    }
`

const Title = styled.div`
    font-weight: 550;
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
        top: 1.2em;
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

export default Detail