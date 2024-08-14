import styled from "styled-components"

import InteractionBox from "@components/social/interaction/InteractionBox"
import DrawerBundle from "@components/social/logDetails/DrawerBundle"
import Quote from "@components/social/logDetails/Quote"

import FollowBox from "../interaction/FollowBox"

const LogDetails = ({
    user,
    quote,
    logDetails,
    saveQuote,
    isFollowingPage,
    selectedDate,
}) => {
    return (
        <>
            <DetailHeader>
                <Quote
                    user={user}
                    quote={quote}
                    saveQuote={saveQuote || null}
                />

                {isFollowingPage ? (
                    quote.id && (
                        <InteractionBox parentType={"quote"} parent={quote} />
                    )
                ) : (
                    <FollowBox user={user} />
                )}

                {/* TODO: who and what emoji */}
            </DetailHeader>

            {/* TODO: When there are no task */}
            <DetailBody>
                {logDetails?.pages.map((group) =>
                    group.results.map(
                        (drawer) =>
                            drawer && (
                                <DrawerBundle
                                    key={drawer.id}
                                    drawer={drawer}
                                    selectedDate={selectedDate}
                                    isFollowingPage={isFollowingPage}
                                />
                            ),
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
