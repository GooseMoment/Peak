import { useState, Fragment, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import SimpleProfile from "@components/social/SimpleProfile"
import ReactionBox from "@components/social/ReactionBox"
import ReactionButton from "@components/social/ReactionButton"
import EmojiPickerButton from "@components/social/EmojiPickerButton"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import { TaskList } from "@components/drawers/Drawer"
import TaskFrame from "@components/tasks/TaskFrame"

import { deleteReaction, getReactions, postReaction } from "@api/social.api"
import queryClient from "@queries/queryClient"
import { toast } from "react-toastify"

const DailyLogDetail = ({dailyComment, userLogDetails, user, saveDailyComment, day}) => {
    const [inputState, setInputState] = useState(false)
    const [comment, setComment] = useState(dailyComment.comment)
    
    useEffect(() => {
        setComment(dailyComment.comment)
    }, [dailyComment, day])

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

        {dailyComment.id && <ReactionBox contentType={'daily_comment'} content={dailyComment} />}

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
                            <Fragment key={task.id}>
                                <TaskFrame task={task} color={drawer.color} />
                                {task.completed_at && <ReactionBox contentType={'task'} content={task} />}
                            </Fragment>
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

const ReactionBoxTemp = styled.div`
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