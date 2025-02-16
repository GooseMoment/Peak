import { Fragment, useMemo, useState } from "react"

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

import { useTranslation } from "react-i18next"

const projectColor = "#0E4A84"

const DemoDrawer = () => {
    const { t } = useTranslation("intro", {
        keyPrefix: "section_organize.demo_drawer",
    })
    const drawers = useMemo(() => makeDrawers(t), [t])
    const [count, setCount] = useState(1)

    return (
        <SubSection>
            <SubTitle>{t("title")}</SubTitle>

            <PageTitle $color={projectColor}>{t("project_name")}</PageTitle>
            {drawers?.slice(0, count)?.map((drawer, i) => (
                <Fragment key={i}>
                    <DrawerBox $color={projectColor} $demo>
                        <DrawerName $color={projectColor} $demo>
                            {drawer.name}
                        </DrawerName>
                    </DrawerBox>
                    {drawer.tasks?.map((task, i) => (
                        <DemoTask color={projectColor} task={task} key={i} />
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
const makeDrawers = (t) => [
    {
        name: t("drawer0.drawer_name"),
        tasks: [
            {
                name: t("drawer0.sample0"),
                completed_at: null,
                due_type: "due_date",
                due_date: tomorrow,
                assigned_at: today,
                priority: 1,
            },
            {
                name: t("drawer0.sample1"),
                completed_at: true,
                due_type: "due_date",
                due_date: today,
                assigned_at: yesterday,
                priority: 0,
            },
            {
                name: t("drawer0.sample2"),
                completed_at: false,
                due_type: "due_date",
                due_date: dayLongAfter,
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
                assigned_at: tomorrow,
                priority: 2,
            },
            {
                name: t("drawer1.sample1"),
                completed_at: true,
                due_type: "due_date",
                due_date: yesterday,
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
                completed_at: false,
                due_type: "due_date",
                due_date: dayAfterTomorrow,
                assigned_at: null,
                priority: 0,
            },
            {
                name: t("drawer2.sample1"),
                completed_at: false,
                due_type: "due_date",
                due_date: today,
                assigned_at: null,
                priority: 1,
            },
            {
                name: t("drawer2.sample2"),
                completed_at: true,
                due_type: "due_date",
                due_date: yesterday,
                assigned_at: yesterday,
                priority: 2,
            },
        ],
    },
]

export default DemoDrawer
