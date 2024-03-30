import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const TitleFrame = ({title, icon, onClose}) => {
    return (
        <TitleFrameBox>
            <TitleBox>
                <FeatherIcon icon={icon}/>
                <TitleText>{title}</TitleText>
            </TitleBox>
            <Icons>
                <FeatherIcon icon="trash-2" />
                <FeatherIcon icon="x" onClick={onClose}/>
            </Icons>
        </TitleFrameBox>
    )
}

const TitleFrameBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0em 1.8em;
    margin-top: 1em;
    margin-bottom: 0.5em;
`

const TitleBox = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    padding-top: 0.8em;

    & svg {
        width: 1.2em;
        height: 1.2em;
        stroke: #000000;
        margin-right: 0.6em;
        top: 0;
    }
`

const TitleText = styled.div`
    font-weight: 480;
    font-size: 1.1em;
    color: #000000;
`

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        cursor: pointer;
        stroke: #FF0000;
        margin-left: 1em;
    }
`


export default TitleFrame