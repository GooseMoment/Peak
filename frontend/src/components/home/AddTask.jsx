import styled from "styled-components"

import MildButton from "@components/common/MildButton"
import Module, { Title } from "@components/home/Module"

import PlusCircle from "@assets/home/PlusCircle"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const AddTask = () => {
    const { t } = useTranslation("home", { keyPrefix: "add_task" })

    const onClick = () => {
        toast.info("Work In Progress!")
    }

    return (
        <Module>
            <Title>{t("title")}</Title>
            <ButtonOpen onClick={onClick}>
                <div>{t("tap_to_open")}</div> <PlusCircle />
            </ButtonOpen>
        </Module>
    )
}

const ButtonOpen = styled(MildButton)`
    background-color: ${(p) => p.theme.accentBackgroundColor};
    color: ${(p) => p.theme.secondTextColor};
    width: 100%;
    padding: 0.5em 0.75em;
    border-radius: 16px;
    text-align: left;
    font-size: 1em;

    display: flex;
    justify-content: space-between;
    align-items: center;

    & svg {
        top: 0;
        margin-right: 0;
    }
`

export default AddTask
