import { skeletonCSS } from "@/assets/skeleton"
import { cubicBeizer } from "@assets/keyframes"

import styled from "styled-components"

const Images = ({profile_img, reaction, skeleton=false}) => {
    const emojiURL = reaction?.emoji?.img_uri

    return <Container>
        {skeleton ? <ProfileImgSkeleton /> : <ProfileImg src={profile_img} />}
        {emojiURL && <EmojiContainer>
            <Emoji src={emojiURL} />
        </EmojiContainer>}
    </Container> 
}

const Container = styled.div`
    position: relative;
    width: calc(8em - 4em);
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

    ${p => skeletonCSS(p)}
`

const EmojiContainer = styled.div`
    position: absolute;
    top: 2.5em;
    left: 2.5em;

    background-color: ${p => p.theme.backgroundColor};
    border-radius: 50%;
    
    width: 3em;
    height: 3em;

    display: flex;
    justify-content: center;
    align-items: center;
`

const Emoji = styled.img`
    width: 2em;
    height: 2em;

    &:hover {
        transform: scale(1.5);
    }

    transition: transform 0.25s ${cubicBeizer};
`

export default Images