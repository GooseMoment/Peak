import { useNavigate } from "react-router-dom"

import styled from "styled-components"

import ProjectNameBox, {
    NameBox,
    NameText,
    TypeText,
} from "@components/project/ProjectNameBox"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import PrivacyIcon from "@components/project/common/PrivacyIcon"

import { Project } from "@api/projects.api"
import { DrawerSearchResult } from "@api/search.api"

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

export const DrawerResultBox = ({ drawer } : { drawer: DrawerSearchResult }) => {
    const color = usePaletteColor(drawer.color)

    return (
        <DrawerBox
            $color={color}
            $isDragging={false}
            $isDraggable={true}>
            <DrawerTitleBox>
                <DrawerName $color={color}>{drawer.name}</DrawerName>
                <PrivacyIcon privacy={drawer.privacy} color={color} />
            </DrawerTitleBox>
            {/* DrawerIcons */}
        </DrawerBox>
    )
}

// TODO: components/drawers/DrawerBlock.tsx와 중복됨
// -> DrawerBlock에서 export하는 방식 괜찮을까? 문제는 없는데 사소하단 느낌이 듦...
const DrawerTitleBox = styled.div`
    display: flex;
    align-items: center;
`

export default ResultBox