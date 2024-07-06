import { useMemo } from "react"

import SubSection, { SubTitle } from "@components/intro/SubSection"
import ProjectName from "@components/project/ProjectName"
import Button, { ButtonGroup } from "@components/common/Button"

import { useTranslation } from "react-i18next"
import { useState } from "react"

const DemoProject = () => {
    const {t} = useTranslation(null, {keyPrefix: "intro.section_organize.Sub_project"}) 
    const [count, setCount] = useState(1)
    const projects = useMemo(() => makeProjects(t), [t])

    return <SubSection>
        <SubTitle>A project contains drawers.</SubTitle>

        {projects?.slice(0, count)?.map(project => <ProjectName key={project.id} project={project} demo />)}

        {count < projects.length && 
            <ButtonGroup $justifyContent="right" $margin="1em 0">
                <Button onClick={() => setCount(count + 1)}>Add project</Button>
            </ButtonGroup>
        }
    </SubSection>
}

const makeProjects = (t) => [
    {
        id: "1",
        name: "한양라이프",
        color: "0E4A84",
        type: "regular",
    },
    {
        id: "2",
        name: "집안일",
        color: "ffbe0b",
        type: "regular",
    },
    {
        id: "3",
        name: "교환학생",
        color: "fb5607",
        type: "goal",
    },
    {
        id: "4",
        name: "8월 오키나와 여행!!",
        color: "ff006e",
        type: "goal",
    },
    {
        id: "5",
        name: "건강해지기",
        color: "3a86ff",
        type: "regular",
    },
]

export default DemoProject
