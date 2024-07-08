import { useState } from "react"

import SubSection from "@components/intro/SubSection"
import RadioGroup from "@components/intro/RadioGroup"
import Radio from "@components/intro/Radio"
import DemoTask from "@components/intro/DemoTask"

import {yesterday, today, tomorrow, nextWeek, twoWeeksLater} from "./todays"

import styled from "styled-components"

import normal from "@assets/project/priority/normal.svg"
import important from "@assets/project/priority/important.svg"
import critical from "@assets/project/priority/critical.svg"

import todayIcon from "@assets/project/calendar/today.svg"
import tomorrowIcon from "@assets/project/calendar/tomorrow.svg"
import next_weekIcon from "@assets/project/calendar/next_week.svg"

const deadlineTable = {
    today,
    tomorrow,
    nextWeek,
    twoWeeksLater,
}

const sampleTasks = [
    {id: 0, name: "토플 공부하기", completed_at: true, priority: 0, due_date: today},
    {id: 1, name: "건강검진 받기", completed_at: true, priority: 1, due_date: yesterday},
    {id: 3, name: "썬크림 사기", completed_at: true, priority: 2, due_date: tomorrow},
    {id: 4, name: "퇴사하기", completed_at: true, priority: 0, due_date: nextWeek},
]

const DemoPlan = () => {
    const [priority, setPriority] = useState("1")
    const [deadline, setDeadline] = useState("today")

    const task = {
        name: "생수 주문하기",
        priority: Number(priority),
        due_date: deadlineTable[deadline],
    }

    return <SubSection>
        <HalfDivider>
            <Selections>
                <Selection>
                    <RadioGroup label="Choose a priority" value={priority} onChange={setPriority}>
                        <Radio value="0"><Icon src={normal} /> Normal</Radio>
                        <Radio value="1"><Icon src={important} /> Important</Radio>
                        <Radio value="2"><Icon src={critical} /> Critical</Radio>
                    </RadioGroup>
                </Selection>
                <Selection>
                    <RadioGroup label="Choose a deadline" value={deadline} onChange={setDeadline}>
                        <Radio value="today"><Icon src={todayIcon} /> Today</Radio>
                        <Radio value="tomorrow"><Icon src={tomorrowIcon} /> Tomorrow</Radio>
                        <Radio value="nextWeek"><Icon src={next_weekIcon} /> Next week</Radio>
                        <Radio value="twoWeeksLater"><Icon src={next_weekIcon} /> Two weeks later</Radio>
                    </RadioGroup>
                </Selection>
            </Selections>
            <Tasks>
                <BlurArea>
                    {sampleTasks.slice(0, 1).map(task => <DemoTask task={task} key={task.id} />)}
                </BlurArea>
                <DemoTask id={2} task={task} />
                <BlurArea>
                    {sampleTasks.slice(1).map(task => <DemoTask task={task} key={task.id} />)}
                </BlurArea>
            </Tasks>
        </HalfDivider>
    </SubSection>
}

const HalfDivider = styled.div`
    display: flex;
    justify-content: space-between;
`

const Selections = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1em;
`

const Selection = styled.div`

`

const Icon = styled.img`
    aspect-ratio: 1/1;
    height: 1em;
    vertical-align: bottom;
`

const Tasks = styled.div`
    width: 50%;
`

const BlurArea = styled.div`
    pointer-events: none;
    user-select: none;
    filter: blur(1px);
`

export default DemoPlan
