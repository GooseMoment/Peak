import { Fragment } from "react"

import styled, { useTheme } from "styled-components"

import { TaskList } from "@components/drawers/Drawer"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import InteractionBox from "@components/social/interaction/InteractionBox"
import Quote from "@components/social/logDetails/Quote"
import TaskBox from "@components/social/logDetails/TaskBox"
import { getProjectColor } from "@components/project/Creates/palettes"

const LogDetails = ({ user, quote, logDetails, saveQuote, isFollowing }) => {
    const theme = useTheme()

    return (
        <>
            <DetailHeader>
                <Quote
                    user={user}
                    quote={quote}
                    saveQuote={saveQuote || null}
                />

                {(isFollowing && quote.id) && (
                    <InteractionBox parentType={"quote"} parent={quote} />
                )}

                {/* TODO: who and what emoji */}
            </DetailHeader>

            {/* TODO: When there are no task */}
            <DetailBody>
                {logDetails &&
                    Object.values(logDetails).map(
                        (drawer) =>
                            // Only show when there are task
                            drawer.tasks.length !== 0 && (
                                <Fragment key={drawer.id}>
                                    <DrawerBox $color={getProjectColor(theme.type, drawer.color)}>
                                        <DrawerName $color={getProjectColor(theme.type, drawer.color)}>
                                            {drawer.name}
                                        </DrawerName>
                                    </DrawerBox>
                                    <TaskList>
                                        {drawer.tasks.map((task) => (
                                            <TaskBox
                                                key={task.id}
                                                task={task}
                                                color={getProjectColor(theme.type, drawer.color)}
                                                isFollowing={isFollowing}
                                            />
                                        ))}
                                    </TaskList>
                                </Fragment>
                            ),
                    )}
            </DetailBody>
        </>
    )
}

const DetailHeader = styled.div`
    padding: 1.2em 1em 0.2em;

    display: flex;
    flex-direction: column;
    gap: 1em;
`

const DetailBody = styled.div`
    max-height: 70%;
    overflow-y: auto;

    // IE and Edge
    -ms-overflow-style: none;
    // Firefox
    scrollbar-width: none;
    // Chrome, Safari, Opera
    &::-webkit-scrollbar {
        display: none;
    }
`

export default LogDetails
