import styled from "styled-components"
import FeatherIcon from "feather-icons-react";
import { DateTime } from "luxon"

import ReactionEmoji from "@components/social/ReactionEmoji";
import EmojiAddButton from "@components/social/EmojiAddButton";
import PeakButton from "@components/social/PeakButton";

const putEllipsis = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

const LogDetailTask = ({ task, color }) => {
    return <LogTaskBox>
        <div style={{display: "flex", flexDirection: "row"}}>
        {task.completedAt ? (
            <FeatherIcon icon="check-circle" />
        ) : (
            <FeatherIcon icon="circle" stroke={color} />
        )}

        <TaskContainer>
            <TaskName>
                {task.completedAt ? (
                    "\"" + putEllipsis(task.name, 32) + "\" 완료!"
                ) : (
                    putEllipsis(task.name, 32)
                )}

            </TaskName>

            {task.completedAt ? (
                <Ago> &nbsp;{DateTime.fromJSDate(task.completedAt).setLocale("en").toRelative()} </Ago>
            ) : null}
        </TaskContainer>
                </div>

        <ReactionBox>
            {task.completedAt ? (
                <>
                    {task.reaction.map((LogDetailTaskEmoji) => (
                        <ReactionEmoji key={LogDetailTaskEmoji.emoji} emoji={LogDetailTaskEmoji} />
                    ))}
                    <EmojiAddButton />
                </>
            ) : (
                <PeakButton id={task.id} num={task.reaction[0].reactionNum}/>
            )}
        </ReactionBox>
    </LogTaskBox>
}

const LogTaskBox = styled.div`
display: flex;
gap: 1em;
flex-direction: column;

padding: 1.2em 1em 1em;
`

const TaskContainer = styled.div`
width: 230pt;
white-space: normal;
line-height: 1.3em;
`

const TaskName = styled.div`
display: inline;
font-size: 1.1em;
`

const Ago = styled.span`
display: inline;
font-size: 0.9em;
color: #A4A4A4;
white-space: nowrap;
`

const ReactionBox = styled.div`
display: flex;
margin-left: auto;
`

export default LogDetailTask