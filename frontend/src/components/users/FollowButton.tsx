import { useState } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"

import Button from "@components/common/Button"
import Confirmation from "@components/common/Confirmation"

import { getCurrentUsername } from "@api/client"
import {
    deleteFollowRequest,
    getFollowing,
    putFollowRequest,
} from "@api/social.api"
import { type User } from "@api/users.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface FollowButtonProp {
    user: User
    disabled?: boolean
}

const FollowButton = ({ user, disabled = false }: FollowButtonProp) => {
    const { t } = useTranslation("translation", { keyPrefix: "follow_button" })

    const currentUsername = getCurrentUsername()

    const [confirmationVisible, setConfirmationVisible] = useState(false)

    const { data: following, isLoading: fetchFollowLoading } = useQuery({
        queryKey: ["followings", currentUsername, user.username],
        queryFn: () => getFollowing(currentUsername!, user.username),
    })

    const putMutation = useMutation({
        mutationFn: () => putFollowRequest(user.username),
        onSuccess: (data) => {
            if (data.status === "requested") {
                toast.info(t("success_requested", { username: user.username }))
            } else {
                toast.success(t("success_follow", { username: user.username }))
            }

            queryClient.setQueryData(
                ["followings", currentUsername, user.username],
                data,
            )
        },
        onError: () => {
            toast.error(t("error_follow", { username: user.username }))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: () => deleteFollowRequest(user.username),
        onSuccess: (data) => {
            if (following?.status === "requested") {
                toast.success(t("success_cancel", { username: user.username }))
            } else {
                toast.success(
                    t("success_unfollow", { username: user.username }),
                )
            }

            queryClient.setQueryData(
                ["followings", currentUsername, user.username],
                data,
            )
        },
        onError: () => {
            if (following?.status === "requested") {
                toast.success(t("error_cancel", { username: user.username }))
            } else {
                toast.success(t("error_unfollow", { username: user.username }))
            }
        },
    })

    const followButtonLoading =
        fetchFollowLoading || putMutation.isPending || deleteMutation.isPending
    const followAccpetedOrRequested =
        following?.status === "accepted" || following?.status === "requested"

    const handleFollow = async () => {
        if (followButtonLoading || disabled) {
            return
        }

        if (!followAccpetedOrRequested) {
            putMutation.mutate()
            return
        }

        if (following?.status === "accepted") {
            setConfirmationVisible(true)
            return
        }

        deleteMutation.mutate()
    }

    const handleConfirmation = () => {
        setConfirmationVisible(false)
        deleteMutation.mutate()
    }

    return (
        <>
            <Button
                onClick={handleFollow}
                loading={followButtonLoading}
                disabled={followButtonLoading || disabled}
                state={
                    (following?.status === "accepted" && "success") ||
                    (following?.status === "requested" && "link") ||
                    "text"
                }>
                {(following?.status === "requested" && t("button_requested")) ||
                    (following?.status === "accepted" &&
                        t("button_accepted")) ||
                    t("button_follow")}
            </Button>
            {confirmationVisible && (
                <Confirmation
                    onClose={() => setConfirmationVisible(false)}
                    question={t("cancel_accepted", {
                        username: user.username,
                    })}
                    buttons={[
                        <Button
                            key="confirm"
                            onClick={handleConfirmation}
                            state="danger">
                            {t("button_unfollow")}
                        </Button>,
                    ]}
                />
            )}
        </>
    )
}

export default FollowButton
