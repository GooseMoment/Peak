import SubSection from "@components/intro/SubSection"
import RadioGroup from "@components/intro/RadioGroup"
import Radio from "@components/intro/Radio"
import Task from "@components/project/Task"

import {today, tomorrow, nextWeek, twoWeeksLater} from "./todays"

import styled from "styled-components"
import { useState } from "react"

const deadlineTable = {
    today,
    tomorrow,
    nextWeek,
    twoWeeksLater,
}

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
                    <RadioGroup label="Choose a priority" value={priority} onChange={value => setPriority(value)}>
                        <Radio value="0">Normal</Radio>
                        <Radio value="1">Important</Radio>
                        <Radio value="2">Critical</Radio>
                    </RadioGroup>
                </Selection>
                <Selection>
                    <RadioGroup label="Choose a deadline" value={deadline} onChange={value => setDeadline(value)}>
                        <Radio value="today">Today</Radio>
                        <Radio value="tomorrow">Tomorrow</Radio>
                        <Radio value="nextWeek">Next week</Radio>
                        <Radio value="twoWeeksLater">Two weeks later</Radio>
                    </RadioGroup>
                </Selection>
            </Selections>
            <Tasks>
                <Task task={task} demo />
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

const Tasks = styled.div`
    width: 50%;
`

export default DemoPlan
