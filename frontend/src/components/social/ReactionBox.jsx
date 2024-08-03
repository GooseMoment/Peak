import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import ReactionButton from "@components/social/ReactionButton"
import EmojiPickerButton from "@components/social/EmojiPickerButton"
import PeckButton from "@components/social/PeckButton"

import queryClient from "@queries/queryClient"
import { deleteReaction, getReactions, postReaction } from "@api/social.api"

const ReactionBox = ({contentType, content}) => {
    const [pickedEmoji, setPickedEmoji] = useState(null)

    const { data: contentReactions, isError: contentReactionsError } = useQuery({
        queryKey: ['reaction', contentType, content.id],
        queryFn: () => getReactions(contentType, content.id),
        enabled: !!content.id
    })

    const contentReactionsMutation = useMutation({
        mutationFn: ({action, emojiID}) => {
            if(action === 'post') {
                return postReaction(contentType, content.id, emojiID)
            }
            else if(action === 'delete') {
                return deleteReaction(contentType, content.id, emojiID)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['reaction', contentType, content.id]})
        },
        onError: (e) => {
            toast.error(e)
        }
    })

    const myReactions = contentReactions ? 
        Object.values(contentReactions.my_reactions) 
        : []

    const handleEmoji = (pickedEmoji) => {
        if(pickedEmoji) {
            if(!(myReactions.some((myReaction) => myReaction.id === pickedEmoji.id))) {
                contentReactionsMutation.mutate({action: 'post', emojiID: pickedEmoji.id})
            }
            setPickedEmoji(null)
        }
    }

    useEffect(() => (
        handleEmoji(pickedEmoji)
    ), [pickedEmoji])

    return <Box>
        {contentReactions && Object.values(contentReactions.reaction_counts).map((reaction, index) => (
                <ReactionButton key={index} emoji={reaction}
                    isSelected={myReactions.some((myReaction) => myReaction.id === reaction[0].id)}
                    saveReaction={contentReactionsMutation.mutate}
                /> 
            ))}
        <EmojiPickerButton pickedEmoji={pickedEmoji} setPickedEmoji={setPickedEmoji}/>
        {contentType === 'task' && <PeckButton taskID={content.id}/>}
    </Box>
}

const Box = styled.div`
    margin-left: auto;

    display: flex;
`

export default ReactionBox