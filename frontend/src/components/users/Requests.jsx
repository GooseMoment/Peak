import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import { Section, SectionTitle } from "@components/users/Section"

import { getCurrentUsername } from "@api/client"
import { patchFollowRequest } from "@api/social.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Requests = ({ user }) => {
    const currentUsername = getCurrentUsername()

    const { t } = useTranslation(null, { keyPrefix: "users" })

    const acceptance = useMutation({
        mutationFn: () => patchFollowRequest(user.username, true),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["followings", currentUsername, user.username],
            })
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
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["followings", currentUsername, user.username],
            })
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

    return (
        <Section>
            <SectionTitle>
                {t("requests_exist", { username: user.username })}
            </SectionTitle>
            {!acceptance.isSuccess && !rejection.isSuccess && (
                <Box>
                    {t("follow_request_sent_to_me")}
                    <ButtonGroup $justifyContent="right">
                        <Button
                            state="danger"
                            onClick={rejection.mutate}
                            loading={rejection.isPending}
                            disabled={isPending}>
                            {t("button_follow_request_reject")}
                        </Button>
                        <Button
                            state="success"
                            onClick={acceptance.mutate}
                            loading={acceptance.isPending}
                            disabled={isPending}>
                            {t("button_follow_request_accept")}
                        </Button>
                    </ButtonGroup>
                </Box>
            )}
            {acceptance.isSuccess && (
                <Box $accepted>{t("follow_request_accepted")}</Box>
            )}
            {rejection.isSuccess && (
                <Box $rejected>{t("follow_request_rejected")}</Box>
            )}
        </Section>
    )
}

const Box = styled.div`
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    border: 1px solid
        ${(p) =>
            (p.$accepted && p.theme.primaryColors.success) ||
            (p.$rejected && p.theme.primaryColors.danger) ||
            p.theme.primaryColors.link};
    border-radius: 16px;

    line-height: 1.5em;

    width: 100%;
    box-sizing: border-box;
    padding: 1.25em;
`

export default Requests
