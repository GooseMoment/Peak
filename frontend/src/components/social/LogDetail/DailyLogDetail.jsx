import { useState, Fragment, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import SimpleProfile from "@components/social/SimpleProfile"
import ReactionBox from "@components/social/ReactionBox"
import LogDetailsTask from "@components/social/LogDetailsTask"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import { TaskList } from "@components/drawers/Drawer"

import queryClient from "@queries/queryClient"
import { toast } from "react-toastify"

const DailyLogDetail = ({dailyComment, userLogDetails, user, saveDailyComment, day}) => {
    const [inputState, setInputState] = useState(false)
    const [content, setContent] = useState(dailyComment.content)
    
    useEffect(() => {
        setContent(dailyComment.content)
    }, [dailyComment, day])

    const handleInputState = () => {
        if(dailyComment.user.username === user.username) 
            setInputState(true)
    }

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const handleKeyDown = (e) => {
        if(e.key == 'Enter') {
            setInputState(false)
            saveDailyComment({day, content})
        }
    }

    const handleBlur = () => {
        setInputState(false)
        saveDailyComment({day, content})
    }

    return <>
        <DetailHeader>
        <CommentRow>
            <SimpleProfile user={dailyComment.user}/>
            <CommentBox onClick={handleInputState}>
                {dailyComment.user.username === user.username && inputState ? (
                    <CommentInput
                        type="text"
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                    />
                ):(
                    dailyComment.content ? (
                        <Comment>{"\""+dailyComment.content+"\""}</Comment>
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
                            <LogDetailsTask key={task.id} task={task} color={drawer.color}/>
                        ))}
                    </TaskList>
                </Fragment>
            ))
        }
        </DetailBody>
    </>
}

const DetailHeader = styled.div`
    padding: 1.2em 1em 0.2em;

    display: flex;
    flex-direction: column;
    gap: 1em;
`

const CommentRow = styled.div`
    display: flex;
    gap: 0.5em;
`

const CommentBox = styled.div`
    width: 72%;
    border-radius: 1em;
    background-color: #e6e6e6;
    padding: 1em;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
`

const Comment = styled.div`
    white-space: normal;
    color: ${props => props.$color};
    font-style: ${props => props.$fontstyle};
`

const CommentInput = styled.input`
    height: 100%;
    width: 100%;
    background-color: inherit;
    text-align: center;
    font-size: 1em;
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