import ProjectNameBox, {
    NameBox,
    NameText,
    TypeText,
} from "@components/project/ProjectNameBox"

import type { Project } from "@api/projects.api"

import { usePaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const DemoProjectName = ({ project }: { project: Partial<Project> }) => {
    const { t } = useTranslation("translation", { keyPrefix: "project_list" })

    const color = usePaletteColor(project.color!)

    return (
        <ProjectNameBox $demo>
            <NameBox>
                <FeatherIcon icon="circle" fill={color} />
                <NameText>{project.name}</NameText>
                <TypeText>
                    {project.type === "regular" && t("type_regular")}
                    {project.type === "goal" && t("type_goal")}
                </TypeText>
            </NameBox>
        </ProjectNameBox>
    )
}

export default DemoProjectName
