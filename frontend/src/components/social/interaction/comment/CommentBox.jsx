import styled, { useTheme } from "styled-components"

import { DateTime } from "luxon"
import { useClientLocale } from "@/utils/clientSettings"

const CommentBox = ({ comment }) => {
    const theme = useTheme()
    const locale = useClientLocale()

    return (
        <Box>
            <ProfileImgWrapper>
                <img src={comment.user.profile_img} />
            </ProfileImgWrapper>
            <Wrapper $color={theme.textColor}>
                <InfoBox>
                    <Username>@{comment.user.username}</Username>
                    <Ago>
                        {DateTime.fromISO(comment.created_at).setLocale(locale).toRelative()}
                    </Ago>
                </InfoBox>

                <Comment>{comment.comment}</Comment>
            </Wrapper>
        </Box>
    )
}

const Box = styled.div`
    min-height: 4em;

    display: flex;
    gap: 0.5em;
`

const ProfileImgWrapper = styled.div`
    & img {
        border-radius: 2em;
    }

    & svg {
        stroke: 2em;
        margin-right: 0;
    }

    & img,
    & svg {
        width: auto;
        height: 3em;
    }
`

const Wrapper = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: column;

    color: ${(props) => props.$color};
`

const InfoBox = styled.div`
    display: flex;
    gap: 0.5em;
`

const Username = styled.div``

const Ago = styled.div`
    font-size: 0.8em;
`

const Comment = styled.div`
    padding: 0.2em 0.4em 0.2em;

    display: flex;
    justify-content: left;
    align-items: center;
`

export default CommentBox
