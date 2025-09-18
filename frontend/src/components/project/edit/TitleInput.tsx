import { ChangeEvent, RefObject, useEffect } from "react"

import styled from "styled-components"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import FeatherIcon, { type FeatherIconName } from "feather-icons-react"
import { useTranslation } from "react-i18next"

interface TitleInputProps {
    name: string
    setName: (name: string) => void
    inputRef: RefObject<HTMLInputElement>
    icon: FeatherIconName
    onClose: () => void
}

const TitleInput = ({
    name,
    setName,
    inputRef,
    icon,
    onClose,
}: TitleInputProps) => {
    const { t } = useTranslation("translation", {
        keyPrefix: "project_drawer_edit",
    })

    const { isMobile } = useScreenType()

    useEffect(() => {
        if (isMobile) {
            return
        }

        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setName(newName)
    }

    return (
        <TitleFrameBox>
            <TitleIcon icon={icon} />
            <InputWrapper>
                <InputText
                    ref={inputRef}
                    type="text"
                    value={name || ""}
                    onChange={onChange}
                    placeholder={t("name_placeholder")}
                />
            </InputWrapper>
            <CloseIcon icon="x" onClick={onClose} />
        </TitleFrameBox>
    )
}

const TitleFrameBox = styled.div`
    width: 100%;

    display: flex;
    align-items: center;
    gap: 0.5em;

    margin-bottom: 0.5em;
`

const TitleIcon = styled(FeatherIcon)`
    aspect-ratio: 1/1;
    width: 1.3em;
    height: 1.3em;

    margin-right: 0;
    stroke: ${(p) => p.theme.textColor};
    top: 0;

    flex-shrink: 0;
`

const InputWrapper = styled.div`
    flex-grow: 1;
    width: 35em;

    padding: 0.3em;

    ${ifMobile} {
        width: auto;
    }
`

const InputText = styled.input`
    width: 100%;

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

const CloseIcon = styled(FeatherIcon)`
    aspect-ratio: 1/1;
    width: 1.1em;
    height: 1.1em;

    cursor: pointer;
    color: ${(p) => p.theme.primaryColors.danger};

    flex-shrink: 0;
`

export default TitleInput
