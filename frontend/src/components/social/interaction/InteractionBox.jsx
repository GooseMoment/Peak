import { useEffect, useState } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import CommentButton from "@components/social/interaction/comment/CommentButton"
import PeckButton from "@components/social/interaction/peck/PeckButton"
import EmojiPickerButton from "@components/social/interaction/reaction/EmojiPickerButton"
import ReactionButton from "@components/social/interaction/reaction/ReactionButton"

import { deleteReaction, getReactions, postReaction } from "@api/social.api"

import queryClient from "@queries/queryClient"

import { toast } from "react-toastify"

const InteractionBox = ({ parentType, parent }) => {
    const [pickedEmoji, setPickedEmoji] = useState(null)

    const { data: parentReactions } = useQuery({
        queryKey: ["reaction", parentType, parent.id],
        queryFn: () => getReactions(parentType, parent.id),
        enabled: !!parent.id,
    })

    const parentReactionsMutation = useMutation({
        mutationFn: ({ action, emojiID }) => {
            if (action === "post") {
                return postReaction(parentType, parent.id, emojiID)
            } else if (action === "delete") {
                return deleteReaction(parentType, parent.id, emojiID)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reaction", parentType, parent.id],
            })
        },
        onError: (e) => {
            toast.error(e)
        },
    })

    const needPickerButton = () => {
        if (parentType === "quote") return true
        if (parentType === "task") return !!parent.completed_at
    }

    const myReactions = parentReactions
        ? Object.values(parentReactions.my_reactions)
        : []

    const handleEmoji = (pickedEmoji) => {
        if (pickedEmoji) {
            if (
                !myReactions.some(
                    (myReaction) => myReaction.id === pickedEmoji.id,
                )
            ) {
                parentReactionsMutation.mutate({
                    action: "post",
                    emojiID: pickedEmoji.id,
                })
            }
            setPickedEmoji(null)
        }
    }

    useEffect(() => handleEmoji(pickedEmoji), [pickedEmoji])

    return (
        <Box>
            {parentReactions &&
                Object.values(parentReactions.reaction_counts).map(
                    (reaction, index) => (
                        <ReactionButton
                            key={index}
                            emoji={reaction.emoji}
                            emojiCount={reaction.counts}
                            isSelected={myReactions.some(
                                (myReactionEmoji) =>
                                    myReactionEmoji.id === reaction.emoji.id,
                            )}
                            saveReaction={parentReactionsMutation.mutate}
                        />
                    ),
                )}
            {needPickerButton() && (
                <EmojiPickerButton
                    setPickedEmoji={setPickedEmoji}
                />
            )}
            <CommentButton parentType={parentType} parent={parent} />
            {parentType === "task" && (
                <PeckButton
                    taskID={parent.id}
                    isUncomplete={!parent.completed_at}
                />
            )}
        </Box>
    )
}

const Box = styled.div`
    margin-left: auto;

    display: flex;
    gap: 0.5em;
`

export default InteractionBox
