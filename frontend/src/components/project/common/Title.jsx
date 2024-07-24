import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const Title = ({name, setName, icon, onClose}) => {    
    const changeName = (e) => {
        setName(e.target.value)
    }

    return (
        <TitleFrameBox>
            <TitleBox>
                <FeatherIcon icon={icon}/>
                <InputText
                    type='text'
                    value={name}
                    onChange={changeName}
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 1.8em;
    margin-top: 1em;
    margin-bottom: 0.5em;
`

const TitleBox = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.5em;

    & svg {
        width: 1.3em;
        height: 1.3em;
        stroke: ${p => p.theme.textColor};
        margin-right: 0.6em;
        top: 0;
    }
`

const InputText = styled.input`
    width: 20em;
    margin: 0.3em;
    font-weight: 500;
    font-size: 1.3em;
    color: ${p => p.theme.textColor};
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
    margin-right: 1.3em;

    & svg {
        width: 1.1em;
        height: 1.1em;
        top: 0.2em;
        cursor: pointer;
        stroke: ${p => p.theme.primaryColors.danger};
    }
`


export default Title