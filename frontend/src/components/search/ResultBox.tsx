import { useNavigate } from "react-router-dom"

import styled from "styled-components"

import ProjectNameBox, {
    NameBox,
    NameText,
    TypeText,
} from "@components/project/ProjectNameBox"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import PrivacyIcon from "@components/project/common/PrivacyIcon"
import Priority from "@components/tasks/Priority"
import TaskCircle from "@components/tasks/TaskCircle"

import { Project } from "@api/projects.api"
import { DrawerSearchResult, TaskSearchResult } from "@api/search.api"

import { ifMobile } from "@utils/useScreenType"

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
            $isDraggable={true}
        >
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
// DrawerBlock 시작
const DrawerTitleBox = styled.div`
    display: flex;
    align-items: center;
`
// DrawerBlock 끝

export const TaskResultBox = ({ task } : { task : TaskSearchResult }) => {
    const isSocial = false
    const isCompleted = task.completed_at !== null
    const hasDate = task.due_type !== null || task.assigned_at !== null

    return (
        <Box>
            <Content>
                <CircleName>
                    <Icons>
                        <Priority
                            hasDate={hasDate}
                            priority={task.priority}
                            isCompleted={isCompleted}
                        />
                        <TaskCircle
                            color={task.color}
                            isCompleted={isCompleted}
                            hasDate={hasDate}
                            isLoading={false}
                        />
                    </Icons>
                    <TaskNameBox
                        $isCompleted={isCompleted}
                        $isSocial={isSocial}
                    >
                        {task.name}
                    </TaskNameBox>
                </CircleName>
            </Content>
        </Box>
    )
}

// TODO: 하하 정말 이러고 싶지 않은데...
// 나중에 patch/mutation 적용하면서 좀 더 정돈되게 해야지..
// TaskFrame 시작
const Box = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.9em;
    margin-bottom: 0.9em;
    width: 100%;

    min-width: 0;
`

const Content = styled.div`
    min-width: 0;
    width: 100%;
`

const CircleName = styled.div`
    display: flex;
    width: 100%;
`

const TaskNameBox = styled.div<{ $isCompleted: boolean; $isSocial?: boolean }>`
    display: inline-block;
    font-size: 1.1em;
    font-style: normal;
    color: ${(p) => {
        if (p.$isCompleted && !p.$isSocial) return p.theme.grey
        return p.theme.textColor
    }};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.3em;
    width: 100%;
    min-width: 0;

    ${ifMobile} {
        white-space: normal;
        word-wrap: normal;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
`

const Icons = styled.div`
    display: flex;
    align-items: center;
`
// TaskFrame 끝


export default ResultBox