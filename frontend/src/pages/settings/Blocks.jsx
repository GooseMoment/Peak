import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Error from "@components/settings/Error"
import Section, { Description, Name, Value } from "@components/settings/Section"
import UnblockButton from "@components/settings/UnblockButton"
import ListUserProfile from "@components/users/ListUserProfile"

import { getBlocks } from "@api/users.api"

import { useTranslation } from "react-i18next"

const Blocks = () => {
    const {
        data: blocks,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["blocks"],
        queryFn: () => getBlocks(),
        refetchOnWindowFocus: false,
    })

    const { t } = useTranslation("settings", { keyPrefix: "blocks" })

    if (isError) {
        return <Error />
    }

    return (
        <>
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
                            <UnblockButton user={user} />
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
