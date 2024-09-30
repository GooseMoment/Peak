import { useEffect } from "react"

import styled from "styled-components"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const TitleInput = ({ name, setName, inputRef, icon, onClose }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const onChange = (e) => {
        const newName = e.target.value
        setName(newName)
    }

    return (
        <TitleFrameBox>
            <TitleBox>
                <FeatherIcon icon={icon} />
                <InputText
                    ref={inputRef}
                    type="text"
                    value={name || ""}
                    onChange={onChange}
                    placeholder={t("create.name_placeholder")}
                />
            </TitleBox>
            <Icons>
                <FeatherIcon icon="x" onClick={onClose} />
            </Icons>
        </TitleFrameBox>
    )
}

const TitleFrameBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5em;
`

const TitleBox = styled.div`
    display: flex;
    align-items: center;

    & svg {
        width: 1.3em;
        height: 1.3em;
        stroke: ${(p) => p.theme.textColor};
        margin-right: 0.6em;
        top: 0;
    }
`

const InputText = styled.input`
    width: 20em;
    margin: 0.3em;
    font-weight: bold;
    font-size: 1.1em;
    color: ${(p) => p.theme.textColor};
    border: none;

    &:focus {
        outline: none;
    }

    &::placeholder {
        font-size: 1em;
    }
`

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        width: 1.1em;
        height: 1.1em;
        cursor: pointer;
        color: ${(p) => p.theme.primaryColors.danger};
    }
`

export default TitleInput
