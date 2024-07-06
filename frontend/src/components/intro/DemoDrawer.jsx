import { Fragment, useState, useMemo } from "react"

import Button, { ButtonGroup } from "@components/common/Button"
import PageTitle from "@components/common/PageTitle"
import SubSection, { SubTitle } from "@components/intro/SubSection"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import DemoTask from "@components/intro/DemoTask"
import { TaskList } from "@components/drawers/Drawer"

import {today, tomorrow, yesterday, dayAfterTomorrow, dayLongAfter} from "./todays"

import { useTranslation } from "react-i18next"

const projectColor = "0E4A84"

const DemoDrawer = () => {
    const {t} = useTranslation(null, {keyPrefix: "intro.section_organize.demo_drawer"}) 
    const drawers = useMemo(() => makeDrawers(t), [t])
    const [count, setCount] = useState(1)

    return <SubSection>
        <SubTitle>A drawer is home for tasks.</SubTitle>

        <PageTitle $color={"#" + projectColor}>한양라이프</PageTitle>
        {drawers?.slice(0, count)?.map((drawer, i) => <Fragment key={i}>
            <DrawerBox $color={projectColor} $demo>
                <DrawerName $color={projectColor} $demo>{drawer.name}</DrawerName>
            </DrawerBox>
            <TaskList>
                {drawer.tasks?.map((task, i) => <DemoTask color={projectColor} task={task} key={i} /> )}
            </TaskList>
        </Fragment> )}

        {count < drawers?.length && 
            <ButtonGroup $justifyContent="right" $margin="1em 0">
                <Button onClick={() => setCount(count + 1)}>Add drawer</Button>
            </ButtonGroup>
        }
    </SubSection>
}

// tasks는 각 drawer별로 2-3개씩
const makeDrawers = (t) => [
    {
        name: "🖋️ 과제",
        tasks: [
            {
                name: "Assignment 11",
                completed_at: null,
                due_date: tomorrow,
                assigned_at: today,
                priority: 1,
            },
            {
                name: "온라인 강의 꼭꼭 보기",
                completed_at: true,
                due_date: today,
                assigned_at: yesterday,
                priority: 0,
            },
            {
                name: "안전교육 이수하기",
                completed_at: false,
                due_date: dayLongAfter,
                assigned_at: null,
                priority: 0,
            },
        ]
    },
    {
        name: "📖 책 읽기",
        tasks: [
            {
                name: "우리 마음은 늘 우리 저 너머로 쓸려 간다",
                completed_at: null,
                due_date: dayAfterTomorrow,
                due_time: null,
                assigned_at: tomorrow,
                priority: 2,
            },
            {
                name: "밤은 짧아, 걸어 아가씨야",
                completed_at: true,
                due_date: yesterday,
                due_time: null,
                assigned_at: yesterday,
                priority: 2,
            },
        ],
    },
    {
        name: "🎈 공모전",
        tasks: [
            {
                name: "구스톤 2024 참가 신청서",
                completed_at: false,
                due_date: dayAfterTomorrow,
                due_time: null,
                assigned_at: null,
                priority: 0,
            },
            {
                name: "같이 나갈 부원들 연락하기",
                completed_at: false,
                due_date: today,
                due_time: null,
                assigned_at: null,
                priority: 1,
            },
            {
                name: "참가 작품 아이디어 회의",
                completed_at: true,
                due_date: yesterday,
                due_time: null,
                assigned_at: yesterday,
                priority: 2,
            },
        ],
    },
]

export default DemoDrawer
