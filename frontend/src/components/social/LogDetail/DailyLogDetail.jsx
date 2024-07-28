import { useState, Fragment, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import SimpleProfile from "@components/social/SimpleProfile"
import ReactionButton from "@components/social/ReactionButton"
import EmojiPickerButton from "@components/social/EmojiPickerButton"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import { TaskList } from "@components/drawers/Drawer"
import TaskFrame from "@components/tasks/TaskFrame"

import { getReactions } from "@api/social.api"

const DailyLogDetail = ({dailyComment, userLogDetails, userLogsDetail, user, saveDailyComment, day}) => {
    const [inputState, setInputState] = useState(false)
    const [comment, setComment] = useState(dailyComment.comment)
    // const [emojiClick, setEmojiClick] = useState(false)

    useEffect(() => {
        setComment(dailyComment.comment)
    }, [dailyComment, day])

    const { data: dailyCommentReactions, isError: dailyCommentReactionsError } = useQuery({
        queryKey: ['reaction', 'daily', 'comment', dailyComment.id],
        queryFn: () => getReactions('daily_comment', dailyComment.id),
        enabled: !!dailyComment.id
    })

    const handleInputState = () => {
        if(dailyComment.user.username === user.username) 
            setInputState(true)
    }

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    const handleKeyDown = (e) => {
        if(e.key == 'Enter') {
            setInputState(false)
            saveDailyComment({day, comment})
        }
    }

    const handleBlur = () => {
        setInputState(false)
        saveDailyComment({day, comment})
    }

    const processReactions = (reactionsObject) => {
        const reactions = Object.values(reactionsObject)[1]
        return Object.values(reactions)
    }

    return <>
        <DetailHeader>
        <CommentRow>
            <SimpleProfile user={dailyComment.user}/>
            <CommentBox onClick={handleInputState}>
                {dailyComment.user.username === user.username && inputState ? (
                    <CommentInput
                        type="text"
                        value={comment}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                    />
                ):(
                    dailyComment.comment ? (
                        <Comment>{"\""+dailyComment.comment+"\""}</Comment>
                    ) : (
                        dailyComment.user.username === user.username ? (
                            <Comment $color="#A4A4A4" $fontstyle="italic">{"Write your daily comments"}</Comment>
                        ) : (
                            <Comment $color="#A4A4A4" $fontstyle="italic">{"No daily comments yet"}</Comment>
                        )
                    )
                )}
            </CommentBox>
        </CommentRow>

        <ReactionBox>
            {dailyCommentReactions && processReactions(dailyCommentReactions).map((reaction, index) => (
                <ReactionButton key={index} emoji={reaction}/> 
            ))}
            <EmojiPickerButton />
        </ReactionBox>

        {/* TODO: who and what emoji */}
        </DetailHeader>
        
        <DetailBody>
        {
            userLogDetails && Object.values(userLogDetails).map((drawer) => (
                (drawer.tasks.length !== 0) && <Fragment key={drawer.id}>
                    <DrawerBox $color={drawer.color}>
                        <DrawerName $color={drawer.color}>{drawer.name}</DrawerName>
                    </DrawerBox>
                    <TaskList>
                        {drawer.tasks.map((task) => (
                            <TaskFrame key={task.id} task={task} color={drawer.color} />
                        ))}
                    </TaskList>
                </Fragment>
            ))
        }
        </DetailBody>
    </>
}

const DetailHeader = styled.div`
display: flex;
flex-direction: column;
gap: 1em;

padding: 1.2em 1em 0.2em;
`

const CommentRow = styled.div`
display: flex;
gap: 1em;
`

const CommentBox = styled.div`
display: flex;
background-color: #e6e6e6;
border-radius: 10pt;
width: 70%;
padding: 1em;
cursor: pointer;

justify-content: center;
align-items: center;
`

const Comment = styled.div`
white-space: normal;
color: ${props => props.$color};
font-style: ${props => props.$fontstyle};
`

const CommentInput = styled.input`
display: flex;
height: 100%;
width: 100%;
text-align: center;
font-size: 1em;
background-color: inherit;
border: 0;
white-space: normal;
`

const ReactionBox = styled.div`
margin-left: auto;

display: flex;
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

export default DailyLogDetail