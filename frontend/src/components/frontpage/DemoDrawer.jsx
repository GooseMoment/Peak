import { useMemo } from "react"

import PageTitle from "@components/common/PageTitle"
import SubSection, { SubTitle } from "@components/frontpage/SubSection"
import DrawerBox, { DrawerName } from "@components/project/DrawerBox"

import { useTranslation } from "react-i18next"

const DemoDrawer = () => {
    const {t} = useTranslation(null, {keyPrefix: "frontpage.section_organize.Sub_drawer"}) 
    const drawers = useMemo(() => makeDrawers(t), [t])

    return <SubSection>
        <SubTitle>A drawer is home for tasks.</SubTitle>

        <PageTitle $color="#FD99E1">한양라이프</PageTitle>
        {drawers?.map((drawer, i) => <DrawerBox key={i} $color="FD99E1" $demo>
            <DrawerName $color="FD99E1" $demo>{drawer.name}</DrawerName>
        </DrawerBox>)}
    </SubSection>
}

const makeDrawers = (t) => [
    {
        name: t("drawers.drawer1.name"),
        tasks: [
            {
                name: t("drawers.drawer1.tasks.task1"),
                completed_at: new Date(),
                due_date: null,
                due_time: null,
                assigned_at: null,
                priority: null,
            },
            {
                name: t("drawers.drawer1.tasks.task2"),
                completed_at: new Date(),
                due_date: null,
                due_time: null,
                assigned_at: null,
                priority: null,
            },
            {
                name: t("drawers.drawer1.tasks.task3"),
                completed_at: new Date(),
                due_date: null,
                due_time: null,
                assigned_at: null,
                priority: null,
            },
            {
                name: t("drawers.drawer1.tasks.task4"),
                completed_at: new Date(),
                due_date: null,
                due_time: null,
                assigned_at: null,
                priority: null,
            },
            {
                name: t("drawers.drawer1.tasks.task5"),
                completed_at: new Date(),
                due_date: null,
                due_time: null,
                assigned_at: null,
                priority: null,
            },
        ]
    },
    {
        name: t("drawers.drawer2"),
    },
    {
        name: t("drawers.drawer3"),
    },
    {
        name: t("drawers.drawer4"),
    },
    {
        name: t("drawers.drawer5"),
    },
]

export default DemoDrawer
