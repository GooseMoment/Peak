import { useMemo } from "react"

import PageTitle from "@components/common/PageTitle"
import SubSection, { SubTitle } from "@components/intro/SubSection"
import DrawerBox, { DrawerName } from "@components/project/DrawerBox"

import { useTranslation } from "react-i18next"
import { Fragment } from "react"
import Task from "../project/Task"

const DemoDrawer = () => {
    const {t} = useTranslation(null, {keyPrefix: "intro.section_organize.Sub_drawer"}) 
    const drawers = useMemo(() => makeDrawers(t), [t])

    return <SubSection>
        <SubTitle>A drawer is home for tasks.</SubTitle>

        <PageTitle $color="#FD99E1">한양라이프</PageTitle>
        {drawers?.map((drawer, i) => <Fragment key={i}>
            <DrawerBox $color="FD99E1" $demo>
                <DrawerName $color="FD99E1" $demo>{drawer.name}</DrawerName>
            </DrawerBox>
            {drawer.tasks.map((task, i) => <Task task={task} key={i} /> )}
        </Fragment> )}
    </SubSection>
}

const makeDrawers = (t) => [
    {
        name: "자료구조론",
        tasks: [
            {
                name: "잠을 자기",
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
        tasks: [],
    },
    {
        name: t("drawers.drawer3"),
        tasks: [],
    },
    {
        name: t("drawers.drawer4"),
        tasks: [],
    },
    {
        name: t("drawers.drawer5"),
        tasks: [],
    },
]

export default DemoDrawer
