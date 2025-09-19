import { Fragment, useMemo, useState } from "react"

import { useTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import PageTitle from "@components/common/PageTitle"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import DemoTask from "@components/intro/DemoTask"
import SubSection, { SubTitle } from "@components/intro/SubSection"

import {
    dayAfterTomorrow,
    dayLongAfter,
    today,
    tomorrow,
    yesterday,
} from "./todays"

import type { DemoMinimalTask } from "@api/tasks.api"

import { type PaletteColorName, getPaletteColor } from "@assets/palettes"

import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const DemoDrawer = () => {
    const { t } = useTranslation("intro", {
        keyPrefix: "section_organize.demo_drawer",
    })
    const drawers = useMemo(() => makeDrawers(t), [t])
    const [count, setCount] = useState(1)
    const theme = useTheme()

    const color = getPaletteColor(theme.type, "deep_blue")

    return (
        <SubSection>
            <SubTitle>{t("title")}</SubTitle>

            <PageTitle $color={color}>{t("project_name")}</PageTitle>
            {drawers?.slice(0, count)?.map((drawer, i) => (
                <Fragment key={i}>
                    <DrawerBox $color={color} $demo>
                        <DrawerName $color={color} $demo>
                            {drawer.name}
                        </DrawerName>
                    </DrawerBox>
                    {drawer.tasks?.map((task, i) => (
                        <DemoTask
                            task={task}
                            color={"deep_blue" as PaletteColorName}
                            key={i}
                        />
                    ))}
                </Fragment>
            ))}

            {count < drawers?.length && (
                <ButtonGroup $justifyContent="right" $margin="1em 0">
                    <Button onClick={() => setCount(count + 1)}>
                        {t("button_add")}
                    </Button>
                </ButtonGroup>
            )}
        </SubSection>
    )
}

// tasks는 각 drawer별로 2-3개씩
function makeDrawers(t: TFunction<"intro", "section_organize.demo_drawer">): {
    name: string
    tasks: DemoMinimalTask[]
}[] {
    return [
        {
            name: t("drawer0.drawer_name"),
            tasks: [
                {
                    name: t("drawer0.sample0"),
                    completed_at: null,
                    due_type: "due_date",
                    due_date: tomorrow,
                    due_datetime: null,
                    assigned_at: today,
                    priority: 1,
                },
                {
                    name: t("drawer0.sample1"),
                    completed_at: new Date().toISOString(),
                    due_type: "due_date",
                    due_date: today,
                    due_datetime: null,
                    assigned_at: yesterday,
                    priority: 0,
                },
                {
                    name: t("drawer0.sample2"),
                    completed_at: null,
                    due_type: "due_date",
                    due_date: dayLongAfter,
                    due_datetime: null,
                    assigned_at: null,
                    priority: 0,
                },
            ],
        },
        {
            name: t("drawer1.drawer_name"),
            tasks: [
                {
                    name: t("drawer1.sample0"),
                    completed_at: null,
                    due_type: "due_date",
                    due_date: dayAfterTomorrow,
                    due_datetime: null,
                    assigned_at: tomorrow,
                    priority: 2,
                },
                {
                    name: t("drawer1.sample1"),
                    completed_at: new Date().toISOString(),
                    due_type: "due_date",
                    due_date: yesterday,
                    due_datetime: null,
                    assigned_at: yesterday,
                    priority: 2,
                },
            ],
        },
        {
            name: t("drawer2.drawer_name"),
            tasks: [
                {
                    name: t("drawer2.sample0"),
                    completed_at: null,
                    due_type: "due_date",
                    due_date: dayAfterTomorrow,
                    due_datetime: null,
                    assigned_at: null,
                    priority: 0,
                },
                {
                    name: t("drawer2.sample1"),
                    completed_at: null,
                    due_type: "due_date",
                    due_date: today,
                    due_datetime: null,
                    assigned_at: null,
                    priority: 1,
                },
                {
                    name: t("drawer2.sample2"),
                    completed_at: new Date().toISOString(),
                    due_type: "due_date",
                    due_date: yesterday,
                    due_datetime: null,
                    assigned_at: yesterday,
                    priority: 2,
                },
            ],
        },
    ]
}

export default DemoDrawer
