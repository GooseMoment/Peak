import { useTheme } from "styled-components"

import ProjectNameBox, {
    NameBox,
    NameText,
    TypeText,
} from "@components/project/ProjectNameBox"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const DemoProjectName = ({ project }) => {
    const { t } = useTranslation(null, { keyPrefix: "project_list" })

    const theme = useTheme()
    const color = getPaletteColor(theme.type, project.color)

    let name = project.type === "inbox" ? t("inbox") : project.name

    return (
        <ProjectNameBox $demo>
            <NameBox>
                <FeatherIcon icon="circle" fill={color} />
                <NameText>{name}</NameText>
                <TypeText>
                    {project.type === "regular" && t("type_regular")}
                    {project.type === "goal" && t("type_goal")}
                </TypeText>
            </NameBox>
        </ProjectNameBox>
    )
}

export default DemoProjectName
