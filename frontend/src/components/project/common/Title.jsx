import { css, styled } from "styled-components"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Title = ({ name, setName, setFunc, isCreate, icon, onClose }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })

    const onchange = (e) => {
        const newName = e.target.value
        setName(newName)
    }

    const changeName = () => {
        setFunc({ name })
        toast.success(t("edit.name_change_success"), {
            toastId: "name_change_success",
        })
    }

    const onEnter = (e) => {
        if (e.key === "Enter") {
            changeName()
        }
    }

    return (
        <TitleFrameBox>
            <TitleBox>
                <FeatherIcon icon={icon} />
                <InputText
                    type="text"
                    value={name || ""}
                    onChange={onchange}
                    onKeyDown={isCreate ? () => {} : onEnter}
                    placeholder={t("create.name_placeholder")}
                />
            </TitleBox>
            <Icons $isCreate={isCreate}>
                {isCreate || <FeatherIcon icon="check" onClick={changeName} />}
                <FeatherIcon icon="x" onClick={onClose} />
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
    margin-right: 1.3em;
    gap: 0.6em;

    & svg {
        width: 1.1em;
        height: 1.1em;
        top: 0.2em;
        cursor: pointer;
        color: ${(p) => p.theme.primaryColors.danger};
    }

    ${(props) =>
        props.$isCreate ||
        css`
            & :nth-child(1) {
                color: ${(p) => p.theme.primaryColors.info};
            }

            & :nth-child(2) {
                stroke: ${(p) => p.theme.primaryColors.danger};
            }
        `}
`

export default Title
