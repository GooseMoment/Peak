import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const TitleFrame = ({name, setName, icon, onClose}) => {    
    const onchange = (e) => {
        setName(e.target.value)
    }

    return (
        <TitleFrameBox>
            <TitleBox>
                <FeatherIcon icon={icon}/>
                <InputText
                    type='text'
                    value={name}
                    onChange={onchange}
                    placeholder="이름을 입력하세요"
                />
            </TitleBox>
            <Icons>
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
    padding-top: 0.5em;

    & svg {
        width: 1.2em;
        height: 1.2em;
        stroke: #000000;
        margin-right: 0.6em;
        top: 0;
    }
`

const InputText = styled.input`
    width: 24em;
    margin: 0.3em;
    font-weight: 480;
    font-size: 1.1em;
    color: #000000;
    border: none;

    &:focus {
        outline: none;
    }

    &::placeholder {
        font-size: 0.9em;
    }
`

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        top: 0.2em;
        cursor: pointer;
        stroke: #FF0000;
        margin-left: 1em;
    }
`


export default TitleFrame