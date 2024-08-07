import styled from "styled-components"
import { DateTime } from "luxon"
import SimpleProfile from "./SimpleProfile"

const putEllipsis = (text, maxLength) => {
    return text.length > maxLength
        ? text.substring(0, maxLength - 3) + "..."
        : text
}

const DailyLogPreview = ({
    dailyLog,
    selectedUsername,
    setSelectedUsername,
}) => {
    const handleSelect = () => {
        setSelectedUsername(
            dailyLog.username === selectedUsername ? null : dailyLog.username,
        )
    }

    const setRingColor = () => {
        return dailyLog.recent_task
            ? dailyLog.recent_task.is_read
                ? "A4A4A4"
                : dailyLog.recent_task.project_color
            : null
    }

    return (
        <Frame
            onClick={handleSelect}
            $bgcolor={
                "#" +
                (dailyLog.username === selectedUsername ? "ffd7c7" : "FEFDFC")
            }
        >
            <SimpleProfile user={dailyLog} ringColor={setRingColor} />
            <RecentTask>
                {dailyLog.recent_task && (
                    <>
                        <TaskName>
                            {" "}
                            {'"' +
                                putEllipsis(dailyLog.recent_task.name, 32) +
                                '" 완료!'}{" "}
                        </TaskName>
                        <Ago>
                            {" "}
                            {DateTime.fromJSDate(
                                dailyLog.recent_task.completed_at,
                            )
                                .setLocale("en")
                                .toRelative()}{" "}
                        </Ago>
                        {/* Ago: Left align? */}
                    </>
                )}
            </RecentTask>
        </Frame>
    )
}

const Frame = styled.div`
    display: flex;
    gap: 1em;

    border-bottom: 1px solid black;
    padding: 1.2em 1em 1.2em;

    background-color: ${(props) => props.$bgcolor};
`

const RecentTask = styled.div`
    padding-top: 0.7em;
    width: 230pt;
    white-space: normal;
    line-height: 1.3em;
`

const TaskName = styled.div`
    display: inline;
    font-size: 1.1em;
`

const Ago = styled.span`
    margin-left: 0.5em;
    display: inline;
    font-size: 0.9em;
    color: #a4a4a4;
    white-space: nowrap;
`

export default DailyLogPreview
