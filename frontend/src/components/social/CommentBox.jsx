import SimpleProfile from "@components/social/SimpleProfile"
import styled from "styled-components"

const CommentBox = ({comment}) => {
    return <Box>
        <ProfileImg>
            <img src={comment.user.profile_img}/>
        </ProfileImg>
        <Wrapper>
            <InfoBox>
                @{comment.user.username}
                {comment.created_at}
            </InfoBox>
            <Comment>
                {comment.comment}
            </Comment>
        </Wrapper>
    </Box>
}

const Box = styled.div`
    min-height: 4em;

    border: solid black;

    display: flex;
    gap: 0.5em;
`

const ProfileImg = styled.div`
    & img {
        border-radius: 2em;
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

const Wrapper = styled.div`
    flex-grow: 1;
    border: solid black;

    display: flex;
    flex-direction: column;
`

const InfoBox = styled.div`
    display: flex;
`

const Comment = styled.div`
    border: solid black;

    padding: 0.4em;

    display: flex;
    justify-content: left;
    align-items: center;
`

export default CommentBox