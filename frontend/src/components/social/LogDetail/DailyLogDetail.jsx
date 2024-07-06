import { useState } from "react";
import styled from "styled-components";

import ReactionEmoji from "@components/social/ReactionEmoji";
import EmojiAddButton from "@components/social/EmojiAddButton";
import LogDetailProject from "@components/social/LogDetail/LogDetailProject";

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox";
import { TaskList } from "@components/drawers/Drawer";
import TaskFrame from "@components/tasks/TaskFrame";

const DailyLogDetail = ({userLogsDetail, isSelf}) => {
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
        <Profile>
            <ProfileImg>
                <img src={userLogsDetail.user.profileImgURI}/>
            </ProfileImg>
            <Username>
                @{userLogsDetail.user.username}
            </Username>
        </Profile>
        <CommentBox onClick={handleInputState}>
            {userLogsDetail.dailyComment.name ? (
                <Comment>{"\""+userLogsDetail.dailyComment.name+"\""}</Comment>
            ) : (
                isSelf ? (
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
                <>
                    <DrawerBox key={dailyProject.projectID} $color={dailyProject.projectColor}>
                        <DrawerName $color={dailyProject.projectColor}>{dailyProject.projectID}</DrawerName>
                    </DrawerBox>
                    <TaskList>
                        {dailyProject.dailytasks?.map((dailytask) => (
                            <TaskFrame task={dailytask} color={dailyProject.projectColor} />
                        ))}
                    </TaskList>
                </>
            ))
        }
        </DetailBody>
    </>
}

const DetailHeader = styled.div`
display: flex;
flex-flow: row wrap;
gap: 1em;

padding: 1.2em 1em 1.2em;
`

const Profile = styled.div`
height: 5em;
width: 5em;
text-align: center;
`

const ProfileImg = styled.div`
position: relative;
width: auto;
height: 3em;
padding-top: 0.5em;
padding-bottom: 0.5em;

& img {
    border-radius: 50%;
}

& svg {
    stroke: 2em;
    margin-right: 0;
}

& img, & svg {
    width: auto;
    height: 3em;
}
`

const Username = styled.div`
font-size: 1em;
text-align: center;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`

const CommentBox = styled.div`
display: flex;
background-color: #e6e6e6;
border-radius: 10pt;
padding: 1em;
margin-right: 0.5em;
width: 210pt;

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