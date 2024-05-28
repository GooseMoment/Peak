import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

const Detail = ({title, children, onClose, width=15}) => {
    return (
        <DetailBox $width={width} $calendar={title === '기한 지정'}>
            <TitleBox>
                <Title>{title}</Title>
                <FeatherIcon icon="x" onClick={onClose} />
            </TitleBox>
            <CLine />
            {children}
        </DetailBox>
    )
}

const DetailBox = styled.div`
    z-index: 999;
    width: ${props=>props.$width}em;
    height: auto;
    max-height: 35em;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
    padding-bottom: ${props => props.$calendar ? "0px" : "20px"};

    &::-webkit-scrollbar {
        width: 13px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: gray;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
        background-color: #D9D9D9;
        border-radius: 10px;
    }
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
    width: 90%;
    margin: 1em 1em 0em;
`

export default Detail