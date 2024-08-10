import { Fragment } from "react"

import styled from "styled-components"

import { TaskList } from "@components/drawers/Drawer"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import InteractionBox from "@components/social/interaction/InteractionBox"
import Quote from "@components/social/logDetails/Quote"
import TaskBox from "@components/social/logDetails/TaskBox"
import DrawerBundle from "@components/social/logDetails/DrawerBundle"

const LogDetails = ({ user, quote, logDetails, saveQuote, isFollowing }) => {

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
                    logDetails.map(
                        (drawer) =>
                            // Only show when there are task
                            drawer && (
                                <DrawerBundle key={drawer.id} drawer={drawer} isFollowing={isFollowing}/>
                            )
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
