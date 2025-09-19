import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Module, { Center, CenteredText, Title } from "@components/home/Module"

import { User, getMe } from "@api/users.api"

import { useTranslation } from "react-i18next"

export default function SetProfileImg() {
    const { t } = useTranslation("home", { keyPrefix: "set_profile_img" })
    const { data: me, isSuccess } = useQuery<User>({
        queryKey: ["users", "me"],
        queryFn: () => getMe(),
    })

    if (
        !isSuccess ||
        me.profile_img !== import.meta.env.VITE_DEFAULT_PROFILE_IMG
    ) {
        return null
    }

    return (
        <Module to="/app/settings/profile">
            <Title displayArrow underline>
                {t("title")}
            </Title>
            <Center>
                <Profile>
                    <img src={me.profile_img} alt="Profile" />
                    <div>{me.username}</div>
                </Profile>
            </Center>
            <CenteredText>{t("description")}</CenteredText>
        </Module>
    )
}

const Profile = styled.div`
    display: flex;
    gap: 0.75em;
    align-items: center;

    padding: 1em;
    background-color: ${(p) => p.theme.secondBackgroundColor};
    border-radius: 18px;

    img {
        aspect-ratio: 1/1;
        height: 2.75em;
        border-radius: 50%;
    }

    div {
        font-weight: 600;
    }
`
