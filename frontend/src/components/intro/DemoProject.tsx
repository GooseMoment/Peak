import { useMemo } from "react"
import { useState } from "react"

import Button, { ButtonGroup } from "@components/common/Button"
import SubSection, { SubTitle } from "@components/intro/SubSection"
import ProjectName from "@components/project/ProjectName"

import { type PaletteColorName } from "@assets/palettes"

import { type TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const DemoProject = () => {
    const { t } = useTranslation("intro", {
        keyPrefix: "section_organize.demo_project",
    })
    const [count, setCount] = useState(1)
    const projects = useMemo(() => makeProjects(t), [t])

    return (
        <SubSection>
            <SubTitle>{t("title")}</SubTitle>

            {projects.slice(0, count).map((project) => (
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

function makeProjects(t: TFunction<"intro", "section_organize.demo_project">): {
    id: string
    name: string
    color: PaletteColorName
    type: "regular" | "goal"
}[] {
    return [
        {
            id: "0",
            name: t("sample0"),
            color: "deep_blue",
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
            color: "pink",
            type: "goal",
        },
        {
            id: "4",
            name: t("sample4"),
            color: "olive",
            type: "regular",
        },
    ]
}

export default DemoProject
