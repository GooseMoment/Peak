import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import ReactionButton from "@components/social/ReactionButton"
import EmojiPickerButton from "@components/social/EmojiPickerButton"
import PeckButton from "@components/social/PeckButton"

import queryClient from "@queries/queryClient"
import { deleteReaction, getReactions, postReaction } from "@api/social.api"

const ReactionBox = ({parentType, parent}) => {
    const [pickedEmoji, setPickedEmoji] = useState(null)

    const { data: parentReactions, isError: parentReactionsError } = useQuery({
        queryKey: ['reaction', parentType, parent.id],
        queryFn: () => getReactions(parentType, parent.id),
        enabled: !!parent.id
    })

    const parentReactionsMutation = useMutation({
        mutationFn: ({action, emojiID}) => {
            if(action === 'post') {
                return postReaction(parentType, parent.id, emojiID)
            }
            else if(action === 'delete') {
                return deleteReaction(parentType, parent.id, emojiID)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['reaction', parentType, parent.id]})
        },
        onError: (e) => {
            toast.error(e)
        }
    })

    const needPickerButton = () => {
        if(parentType === 'daily_comment')
            return true
        if(parentType === 'task')
            return !!parent.completed_at
    }

    const myReactions = parentReactions ? 
        Object.values(parentReactions.my_reactions) 
        : []

    const handleEmoji = (pickedEmoji) => {
        if(pickedEmoji) {
            if(!(myReactions.some((myReaction) => myReaction.id === pickedEmoji.id))) {
                parentReactionsMutation.mutate({action: 'post', emojiID: pickedEmoji.id})
            }
            setPickedEmoji(null)
        }
    }

    useEffect(() => (
        handleEmoji(pickedEmoji)
    ), [pickedEmoji])

    return <Box>
        {parentReactions && Object.values(parentReactions.reaction_counts).map((reaction, index) => (
                <ReactionButton key={index} emoji={reaction}
                    isSelected={myReactions.some((myReaction) => myReaction.id === reaction[0].id)}
                    saveReaction={parentReactionsMutation.mutate}
                /> 
            ))}
        {needPickerButton() && <EmojiPickerButton pickedEmoji={pickedEmoji} setPickedEmoji={setPickedEmoji}/>}
        {parentType === 'task' && <PeckButton taskID={parent.id} isUncomplete={!parent.completed_at}/>}
    </Box>
}

const Box = styled.div`
    margin-left: auto;

    display: flex;
    gap: 0.5em;
`

export default ReactionBox