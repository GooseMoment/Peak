import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import styled from "styled-components"

import ProjectNameBox, {
    NameBox,
    NameText,
    TypeText,
} from "@components/project/ProjectNameBox"

import { type Project } from "@api/projects.api"

import { usePaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const ResultBox = () => {

}

export const ProjectResultBox = ({ project } : { project: Project }) => {
    const { t } = useTranslation("translation", { keyPrefix: "project_list" })
    const color = usePaletteColor(project.color)

    const isInbox = project.type === "inbox"
    const navigate = useNavigate()
    
    const projectLink =
        project.type === "inbox"
            ? "/app/projects/inbox"
            : `/app/projects/${project.id}`
    
    const name = project.type === "inbox" ? t("inbox") : project.name

    return (
        <ProjectNameBox
            $isInbox={isInbox}>
            <NameBox>
                <FeatherIcon icon="circle" fill={color} />
                <div onClick={() => navigate(projectLink)} role="link">
                    <NameText>{name}</NameText>
                </div>
                <TypeText>
                    {project.type === "regular" && t("type_regular")}
                    {project.type === "goal" && t("type_goal")}
                </TypeText>
            </NameBox>
        </ProjectNameBox>
    )
}

export default ResultBox