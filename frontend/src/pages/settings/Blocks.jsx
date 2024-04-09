import { useLoaderData } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync } from "@components/settings/Section"
import Button from "@components/sign/Button"

import styled from "styled-components"

const Blocks = () => {
    const blocks = useLoaderData()

    return <>
        <PageTitle>Blocks <Sync /></PageTitle>
        <Section>
            <Name>Users blocked by me</Name>
            <Value>
                {blocks.map(user => <UserContainer key={user.username}>
                    <Profile>
                        <ProfileImg src={user.profile_img} />
                        <Username>@{user.username}</Username>
                    </Profile>
                    <Button>Unblock</Button>
                </UserContainer>)}
            </Value>
        </Section>
    </>
}

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1em;
    border-bottom: 1px #ddd solid;
`

const Profile = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
`

const ProfileImg = styled.img`
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    width: 3em;
`

const Username = styled.div`
    font-weight: 600;
`

export default Blocks