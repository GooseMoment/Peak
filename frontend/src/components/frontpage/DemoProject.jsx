import SubSection, { SubTitle } from "@components/frontpage/SubSection"
import ProjectName from "@components/project/ProjectName"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const DemoProject = () => {
    const {t} = useTranslation(null, {keyPrefix: "frontpage.section_organize.Sub_project"}) 
    const projects = useMemo(() => makeProjects(t), [t])

    return <SubSection>
        <SubTitle>A project contains drawers.</SubTitle>

        {projects?.map(project => <ProjectName key={project.id} project={project} demo />)}
    </SubSection>
}

const makeProjects = (t) => [
    {
        id: "1",
        name: t("projects.project1"),
        color: "#",
        type: "regular",
    },
    {
        id: "2",
        name: t("projects.project2"),
        color: "#",
        type: "regular",
    },
    {
        id: "3",
        name: t("projects.project3"),
        color: "#",
        type: "goal",
    },
    {
        id: "4",
        name: t("projects.project4"),
        color: "#",
        type: "goal",
    },
    {
        id: "5",
        name: t("projects.project5"),
        color: "#",
        type: "regular",
    },
]

export default DemoProject
