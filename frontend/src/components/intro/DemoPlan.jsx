import { useMemo, useState } from "react"

import styled from "styled-components"

import DemoTask from "@components/intro/DemoTask"
import Radio from "@components/intro/Radio"
import RadioGroup from "@components/intro/RadioGroup"
import SubSection from "@components/intro/SubSection"

import { nextWeek, today, tomorrow, twoWeeksLater, yesterday } from "./todays"

import { ifMobile } from "@utils/useScreenType"

import next_weekIcon from "@assets/project/calendar/next_week.svg"
import todayIcon from "@assets/project/calendar/today.svg"
import tomorrowIcon from "@assets/project/calendar/tomorrow.svg"
import critical from "@assets/project/priority/critical.svg"
import important from "@assets/project/priority/important.svg"
import normal from "@assets/project/priority/normal.svg"

import { useTranslation } from "react-i18next"

const projectColor = "#ff4a03"

const deadlineTable = {
    today,
    tomorrow,
    nextWeek,
    twoWeeksLater,
}

const makeSampleTasks = (t) => [
    {
        id: 0,
        name: t("sample0"),
        completed_at: true,
        priority: 0,
        due_date: today,
    },
    {
        id: 2,
        name: t("sample2"),
        completed_at: true,
        priority: 1,
        due_date: yesterday,
    },
    {
        id: 3,
        name: t("sample3"),
        completed_at: true,
        priority: 2,
        due_date: tomorrow,
    },
    {
        id: 4,
        name: t("sample4"),
        completed_at: true,
        priority: 0,
        due_date: nextWeek,
    },
]

const DemoPlan = () => {
    const { t } = useTranslation(null, { keyPrefix: "intro.section_plan.demo" })
    const { t: taskT } = useTranslation(null, { keyPrefix: "task" })

    const [priority, setPriority] = useState("1")
    const [deadline, setDeadline] = useState("today")

    const task = {
        name: t("sample1"),
        priority: Number(priority),
        due_date: deadlineTable[deadline],
    }

    const sampleTasks = useMemo(() => makeSampleTasks(t), [t])

    return (
        <SubSection>
            <HalfDivider>
                <Selections>
                    <Selection>
                        <RadioGroup
                            label={t("priority_selection")}
                            value={priority}
                            onChange={setPriority}>
                            <Radio value="0">
                                <Icon src={normal} /> {taskT("priority.normal")}
                            </Radio>
                            <Radio value="1">
                                <Icon src={important} />{" "}
                                {taskT("priority.important")}
                            </Radio>
                            <Radio value="2">
                                <Icon src={critical} />{" "}
                                {taskT("priority.critical")}
                            </Radio>
                        </RadioGroup>
                    </Selection>
                    <Selection>
                        <RadioGroup
                            label={t("deadline_selection")}
                            value={deadline}
                            onChange={setDeadline}>
                            <Radio value="today">
                                <Icon src={todayIcon} />{" "}
                                {taskT("due.quick.today")}
                            </Radio>
                            <Radio value="tomorrow">
                                <Icon src={tomorrowIcon} />{" "}
                                {taskT("due.quick.tomorrow")}
                            </Radio>
                            <Radio value="nextWeek">
                                <Icon src={next_weekIcon} />{" "}
                                {taskT("due.quick.next_week")}
                            </Radio>
                            <Radio value="twoWeeksLater">
                                <Icon src={next_weekIcon} />{" "}
                                {taskT("due.quick.next_two_weeks")}
                            </Radio>
                        </RadioGroup>
                    </Selection>
                </Selections>
                <Tasks>
                    <BlurArea>
                        {sampleTasks.slice(0, 1).map((task) => (
                            <DemoTask task={task} key={task.id} />
                        ))}
                    </BlurArea>
                    <DemoTask id={2} task={task} color={projectColor} />
                    <BlurArea>
                        {sampleTasks.slice(1).map((task) => (
                            <DemoTask task={task} key={task.id} />
                        ))}
                    </BlurArea>
                </Tasks>
            </HalfDivider>
        </SubSection>
    )
}

const HalfDivider = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    ${ifMobile} {
        gap: 1em;
    }
`

const Selections = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1em;

    ${ifMobile} {
        flex-direction: row;
        justify-content: center;
        gap: 3em;
        width: 100%;
    }
`

const Selection = styled.div`
    font-size: 0.9em;
    white-space: nowrap;
`

const Icon = styled.img`
    aspect-ratio: 1/1;
    height: 1em;
`

const Tasks = styled.div`
    width: 50%;

    ${ifMobile} {
        width: unset;
    }
`

const BlurArea = styled.div`
    pointer-events: none;
    user-select: none;
    filter: blur(1px);
`

export default DemoPlan
