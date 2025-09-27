import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import { Section, SectionTitle } from "@components/users/Section"

import { getCurrentUsername } from "@api/client"
import { patchFollowRequest } from "@api/social.api"
import { type User } from "@api/users.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface FollowRequestActionProps {
    user: User
}

export default function FollowRequestAction({
    user,
}: FollowRequestActionProps) {
    const currentUsername = getCurrentUsername()

    const { t } = useTranslation("translation", { keyPrefix: "users" })

    const acceptance = useMutation({
        mutationFn: () => patchFollowRequest(user.username, true),
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["followings", user.username, currentUsername],
                data,
            )
        },
        onError: () => {
            toast.error(
                t("follow_request_acceptance_error", {
                    username: user.username,
                }),
            )
        },
    })

    const rejection = useMutation({
        mutationFn: () => patchFollowRequest(user.username, false),
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["followings", user.username, currentUsername],
                data,
            )
        },
        onError: () => {
            toast.error(
                t("follow_request_rejection_error", {
                    username: user.username,
                }),
            )
        },
    })

    const isPending = acceptance.isPending || rejection.isPending

    if (acceptance.isSuccess) {
        return <AcceptedBox>{t("follow_request_accepted")}</AcceptedBox>
    }
    if (rejection.isSuccess) {
        return <RejectedBox>{t("follow_request_rejected")}</RejectedBox>
    }

    return (
        <Box>
            {t("follow_request_sent_to_me")}
            <ButtonGroup $margin="0.5em 0 0 0" $justifyContent="right">
                <Button
                    state="danger"
                    onClick={() => rejection.mutate()}
                    loading={rejection.isPending}
                    disabled={isPending}>
                    {t("button_follow_request_reject")}
                </Button>
                <Button
                    state="success"
                    onClick={() => acceptance.mutate()}
                    loading={acceptance.isPending}
                    disabled={isPending}>
                    {t("button_follow_request_accept")}
                </Button>
            </ButtonGroup>
        </Box>
    )
}

export function SectionFollowRequestAction({ user }: FollowRequestActionProps) {
    const { t } = useTranslation("translation", { keyPrefix: "users" })
    return (
        <Section>
            <SectionTitle>
                {t("requests_exist", { username: user.username })}
            </SectionTitle>
            <FollowRequestAction user={user} />
        </Section>
    )
}

const Box = styled.div`
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    border: 1px solid ${(p) => p.theme.primaryColors.link};
    border-radius: 16px;

    line-height: 1.5em;

    width: 100%;
    box-sizing: border-box;
    padding: 1.25em;
`

const AcceptedBox = styled(Box)`
    border-color: ${(p) => p.theme.primaryColors.success};
`

const RejectedBox = styled(Box)`
    border-color: ${(p) => p.theme.primaryColors.danger};
`
