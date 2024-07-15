import { useState } from "react";
import styled from "styled-components";

import ReactionEmoji from "@components/social/ReactionEmoji";
import EmojiAddButton from "@components/social/EmojiAddButton";

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox";
import { TaskList } from "@components/drawers/Drawer";
import TaskFrame from "@components/tasks/TaskFrame";
import { Fragment } from "react";
import SimpleProfile from "../SimpleProfile";

const DailyLogDetail = ({dailyComment, userLogsDetail}) => {
    const [tempText, setTempText] = useState(null)
    const [inputState, setInputState] = useState(false)
    // const [emojiClick, setEmojiClick] = useState(false)

    const handleChange = (e) => {
        setTempText(e.target.value)
    }

    const handleInputState = () => {
        setInputState(prev => !prev)
    }

    return <>
        <DetailHeader>
        <CommentRow>
            <SimpleProfile user={dailyComment.user}/>
            <CommentBox onClick={handleInputState}>
                {dailyComment.comment ? (
                    <Comment>{"\""+dailyComment.comment+"\""}</Comment>
                ) : (
                    dailyComment.user.is_me ? (
                        <CommentInput 
                        type="text" 
                        value={tempText}
                        onChange={handleChange}
                        placeholder="Write your daily comments"
                    />
                    ) : (
                        <Comment $color="#A4A4A4" $fontstyle="italic">{"No daily comments yet"}</Comment>
                    )
                )}
            </CommentBox>
        </CommentRow>

        <ReactionBox>
            {userLogsDetail.dailyComment.reaction.map((dailyCommentEmoji) => (
                // <ReactionEmoji emojiClick={emojiClick} setEmojiClick={setEmojiClick} emoji={dailyCommentEmoji}/>
                <ReactionEmoji key={dailyCommentEmoji.emoji} emoji={dailyCommentEmoji}/>
            ))
            }
            <EmojiAddButton />
        </ReactionBox>
        {/* TODO: who and what emoji */}
        </DetailHeader>
        
        <DetailBody>
        {
            userLogsDetail.dailyProjects?.map((dailyProject) => (
                <Fragment key={dailyProject.projectID}>
                    <DrawerBox $color={dailyProject.projectColor}>
                        <DrawerName $color={dailyProject.projectColor}>{dailyProject.projectID}</DrawerName>
                    </DrawerBox>
                    <TaskList>
                        {dailyProject.dailytasks?.map((dailytask) => (
                            <TaskFrame key={dailytask.id} task={dailytask} color={dailyProject.projectColor} />
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
padding: 1em;
margin-right: 0.5em;
flex-grow: 1;

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
background-color: inherit;
border: 0;
white-space: normal;
`

const ReactionBox = styled.div`
margin-left: auto;
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