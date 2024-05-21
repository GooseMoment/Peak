import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync, Description } from "@components/settings/Section"
import Button from "@components/common/Button"
import Loading from "@components/settings/Loading"
import Error from "@components/settings/Error"

import { getBlocks } from "@api/users.api"

import styled from "styled-components"
import { toast } from "react-toastify"
import { useMutation, useQuery } from "@tanstack/react-query"
import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"

const Blocks = () => {
    const {data: blocks, isPending, isError} = useQuery({
        queryKey: ["blocks"],
        queryFn: () => getBlocks(),
    })

    const mutation = useMutation({
        mutationFn: (data) => {
            return null // TODO: edit here after blocking api callback was made
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["blocks"]})
        },
    })

    const { t } = useTranslation(null, {keyPrefix: "settings.blocks"})

    const onClick = () => {
        toast.warn("Not implemented yet!")
        mutation.mutate(null)
    }

    if (isPending) {
        return <Loading />
    }

    if (isError) {
        return <Error />
    }

    return <>
        <PageTitle>{t("title")} <Sync /></PageTitle>
        <Section>
            <Name>{t("blockees.name")}</Name>
            <Description>{t("blockees.description")}</Description>
            <Value>
                {blocks.map(user => <UserContainer key={user.username}>
                    <Profile>
                        <ProfileImg src={user.profile_img} />
                        <Username>@{user.username}</Username>
                    </Profile>
                    <Button onClick={onClick}>{t("blockees.button_unblock")}</Button>
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
