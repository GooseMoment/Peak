import { useMemo } from "react"
import { useState } from "react"

import Button, { ButtonGroup } from "@components/common/Button"
import SubSection, { SubTitle } from "@components/intro/SubSection"
import ProjectName from "@components/project/ProjectName"

import { useTranslation } from "react-i18next"

const DemoProject = () => {
    const { t } = useTranslation(null, {
        keyPrefix: "intro.section_organize.demo_project",
    })
    const [count, setCount] = useState(1)
    const projects = useMemo(() => makeProjects(t), [t])

    return (
        <SubSection>
            <SubTitle>{t("title")}</SubTitle>

            {projects?.slice(0, count)?.map((project) => (
                <ProjectName key={project.id} project={project} demo />
            ))}

            {count < projects.length && (
                <ButtonGroup $justifyContent="right" $margin="1em 0">
                    <Button onClick={() => setCount(count + 1)}>
                        {t("button_add")}
                    </Button>
                </ButtonGroup>
            )}
        </SubSection>
    )
}

const makeProjects = (t) => [
    {
        id: "0",
        name: t("sample0"),
        color: "dark_blue",
        type: "regular",
    },
    {
        id: "1",
        name: t("sample1"),
        color: "yellow",
        type: "regular",
    },
    {
        id: "2",
        name: t("sample2"),
        color: "orange",
        type: "goal",
    },
    {
        id: "3",
        name: t("sample3"),
        color: "peach",
        type: "goal",
    },
    {
        id: "4",
        name: t("sample4"),
        color: "turquoise",
        type: "regular",
    },
]

export default DemoProject
