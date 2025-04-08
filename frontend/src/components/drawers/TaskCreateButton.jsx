import styled from "styled-components"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const TaskCreateButton = ({ isOpen, onClick }) => {
    const { t } = useTranslation("translation", { keyPrefix: "project" })

    return (
        <TaskCreateButtonBox onClick={onClick}>
            {isOpen ? (
                <>
                    <FeatherIcon icon="x-circle" />
                    <TaskCreateText>
                        {t("button_close_add_task")}
                    </TaskCreateText>
                </>
            ) : (
                <>
                    <FeatherIcon icon="plus-circle" />
                    <TaskCreateText>{t("button_add_task")}</TaskCreateText>
                </>
            )}
        </TaskCreateButtonBox>
    )
}

const TaskCreateButtonBox = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1em;
    margin-left: 1.9em;
    cursor: pointer;
    & svg {
        width: 1.1em;
        height: 1.1em;
        top: 0;
    }
`

const TaskCreateText = styled.div`
    font-size: 1.1em;
    font-weight: medium;
    color: ${(p) => p.theme.textColor};
    margin-top: 0em;
`

export default TaskCreateButton
