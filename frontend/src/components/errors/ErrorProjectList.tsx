import styled from "styled-components"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const ErrorProjectList = ({ refetch }: { refetch: () => void }) => {
    const { t } = useTranslation("translation", { keyPrefix: "project_list" })

    return (
        <ProjectListErrorBox onClick={refetch}>
            <FeatherIcon icon="alert-triangle" />
            {t("error_load_project_list")}
        </ProjectListErrorBox>
    )
}

const ProjectListErrorBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3em;
    margin: 1.5em 0em;
    border-radius: 15px;
    font-size: 1.3em;
    color: ${(p) => p.theme.white};
    background-color: ${(p) => p.theme.primaryColors.danger};
    cursor: pointer;
`

export default ErrorProjectList
