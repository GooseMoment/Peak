import styled from "styled-components"
import { DateTime } from "luxon"

const putEllipsis = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength-3) + '...' : text;
}

const DailyLogsPreview = ({userLogSimple, selectedIndex, setSelectedIndex}) => {
    
    const handleSelect = () => {
    // ~Log.index can be replaced with ~Log.task.id
        setSelectedIndex(userLogSimple.username === selectedIndex ? null : userLogSimple.username)
    }

    return <Frame onClick={handleSelect}
            $bgcolor={userLogSimple.username === selectedIndex? "#ffd7c7" : "#FEFDFC"}
        >
        {/* separate the "Profile" into a separate file? */}
        {/* TODO: 화면 너비 줄이면 프로필 이름 길이에 따라 배열 망가지는 문제 해결 */}
        <Profile>
            {/* {userLogSimple.isRead ? "#A4A4A4" : userLogSimple.task.projectColor} */}
            <ProfileImgWrapper $color="#A4A4A4" >
                <img src={userLogSimple.profile_img}/>
            </ProfileImgWrapper>
            <Username>
                @{userLogSimple.username}
            </Username>
        </Profile>
        <RecentTask>
            {userLogSimple.recent_task && (
                <>
                    <TaskName>  {"\"" + putEllipsis(userLogSimple.recent_task.name, 32) + "\" 완료!"} </TaskName>
                    <Ago> {DateTime.fromJSDate(userLogSimple.recent_task.completed_at).setLocale("en").toRelative()} </Ago>
                    {/* Ago: Left align? */}
                </>
            )}
            
        </RecentTask>
    </ Frame>
}

const Frame = styled.div`
display: flex;
gap: 1em;

border-bottom: 1px solid black;
padding: 1.2em 1em 1.2em;

background-color: ${props => props.$bgcolor};
`

const Profile = styled.div`
height: 5em;
width: 6em;
text-align: center;

`

const ProfileImgWrapper = styled.div`
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
    box-shadow: 0 0 0 2.5px #FEFDFC, 0 0 0 5px ${props => props.$color};
}
`

const Username = styled.div`
font-size: 1em;
text-align: center;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`

const RecentTask = styled.div`
padding-top: 0.7em;
width: 230pt;
white-space: normal;
line-height: 1.3em;
`

const TaskName = styled.div`
display: inline;
font-size: 1.1em;
`

const Ago = styled.span`
margin-left: 0.5em;
display: inline;
font-size: 0.9em;
color: #A4A4A4;
white-space: nowrap;
`

export default DailyLogsPreview;