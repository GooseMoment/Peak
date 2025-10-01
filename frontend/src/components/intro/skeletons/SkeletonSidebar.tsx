import styled from "styled-components"

import { ifMobile } from "@utils/useScreenType"

export default function SkeletonSidebar() {
    return (
        <Frame>
            <Items>
                <Item />
                <Item />
                <Item />
                <Item />
            </Items>
            <Profile>
                <ProfileImg />
                <ProfileName />
            </Profile>
        </Frame>
    )
}

const Frame = styled.div`
    position: relative;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: 100%;
    width: 30%;

    padding: 1.25em;

    background-color: ${(p) => p.theme.sidebar.backgroundColor};

    ${ifMobile} {
        display: none;
    }
`

const Items = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const Item = styled.div`
    border-radius: 4px;

    width: 100%;
    height: 1.5em;

    background-color: ${(p) => p.theme.sidebar.activeBackgroundColor};
`

const Profile = styled.div`
    display: flex;
    gap: 0.5em;
`

const ProfileImg = styled.div`
    height: 2em;

    border-radius: 50%;
    aspect-ratio: 1/1;

    background-color: ${(p) => p.theme.grey};
`

const ProfileName = styled.div`
    width: 100%;
    height: 2em;

    border-radius: 4px;
    background-color: ${(p) => p.theme.grey};
`
