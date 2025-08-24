import styled from "styled-components"

import { type Emoji } from "@api/social.api"
import { type User } from "@api/users.api"

import { cubicBeizer } from "@assets/keyframes"
import { skeletonCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"

interface AvatarProps {
    relatedUser?: User
    emoji?: Emoji | string
    projectColor?: string
    skeleton?: boolean
}

const Avatar = ({
    relatedUser,
    emoji,
    projectColor,
    skeleton = false,
}: AvatarProps) => {
    return (
        <Container>
            {skeleton && <ProfileImgSkeleton />}
            {relatedUser && <ProfileImg src={relatedUser.profile_img} />}
            {projectColor && (
                <TaskReminderIconBox $color={projectColor}>
                    <FeatherIcon icon="clock" />
                </TaskReminderIconBox>
            )}
            {emoji && (
                <EmojiContainer>
                    {typeof emoji === "string" ? (
                        <EmojiContent>{emoji}</EmojiContent>
                    ) : (
                        <EmojiImg draggable="false" src={emoji.img} />
                    )}
                </EmojiContainer>
            )}
        </Container>
    )
}

const Container = styled.div`
    position: relative;
    height: 4em;
    aspect-ratio: 1/1;
`

const ProfileImg = styled.img`
    border-radius: 50%;
    height: 100%;
    aspect-ratio: 1 / 1;
`

const ProfileImgSkeleton = styled.div`
    border-radius: 50%;
    height: 100%;
    aspect-ratio: 1 / 1;

    ${skeletonCSS()}
`

const TaskReminderIconBox = styled.div<{ $color: string }>`
    border-radius: 50%;
    height: 100%;
    aspect-ratio: 1 / 1;

    background-color: ${(p) => p.$color};

    display: flex;
    justify-content: center;
    align-items: center;

    & svg {
        margin-right: 0;
        top: 0;
        font-size: 2.5em;
        color: white;
        mix-blend-mode: difference;
    }
`

const EmojiContainer = styled.div`
    position: absolute;
    top: 2.5em;
    left: 2.5em;

    background-color: ${(p) => p.theme.backgroundColor};
    border-radius: 50%;

    width: 3em;
    height: 3em;

    display: flex;
    justify-content: center;
    align-items: center;
`

const EmojiImg = styled.img`
    height: 2em;

    &:hover {
        transform: scale(1.5);
    }

    transition: transform 0.25s ${cubicBeizer};
`

const EmojiContent = styled.span`
    display: inline-flex;
    justify-content: center;
    align-items: center;

    font-size: 2em;

    &:hover {
        transform: scale(1.5);
    }

    transition: transform 0.25s ${cubicBeizer};
`

export default Avatar
