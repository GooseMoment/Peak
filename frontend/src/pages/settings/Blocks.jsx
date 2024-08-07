import PageTitle from "@components/common/PageTitle"
import Section, {
    Name,
    Value,
    Sync,
    Description,
} from "@components/settings/Section"
import Button from "@components/common/Button"
import Error from "@components/settings/Error"
import ListUserProfile from "@components/users/ListUserProfile"

import { getBlocks } from "@api/users.api"

import { toast } from "react-toastify"
import { useMutation, useQuery } from "@tanstack/react-query"
import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import styled from "styled-components"

const Blocks = () => {
    const {
        data: blocks,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["blocks"],
        queryFn: () => getBlocks(),
    })

    const mutation = useMutation({
        mutationFn: (data) => {
            return null // TODO: edit here after blocking api callback was made
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blocks"] })
        },
    })

    const { t } = useTranslation(null, { keyPrefix: "settings.blocks" })

    const onClick = () => {
        toast.warn("Not implemented yet!")
        mutation.mutate(null)
    }

    if (isError) {
        return <Error />
    }

    return (
        <>
            <PageTitle>
                {t("title")} <Sync name={t("title")} />
            </PageTitle>
            <Section>
                <Name>{t("blockees.name")}</Name>
                <Description>{t("blockees.description")}</Description>
                <Value>
                    {isPending &&
                        [...Array(10)].map((_, i) => (
                            <ListUserProfile key={i} skeleton />
                        ))}
                    {blocks?.map((user) => (
                        <ListUserProfile user={user} key={user.username}>
                            <Button onClick={onClick}>
                                {t("blockees.button_unblock")}
                            </Button>
                        </ListUserProfile>
                    ))}
                    {blocks?.length === 0 && (
                        <Message>{t("blockees.empty")}</Message>
                    )}
                </Value>
            </Section>
        </>
    )
}

// TODO: Integrate with @components/users/FollowList.jsx
const Message = styled.div`
    color: ${(p) => p.theme.grey};

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    aspect-ratio: 3/2;
`

export default Blocks
