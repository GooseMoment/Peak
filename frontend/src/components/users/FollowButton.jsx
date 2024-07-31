import { useState } from "react"

import Button, { buttonForms } from "@components/common/Button"
import { deleteFollowRequest, getFollow, putFollowRequest } from "@api/social.api"
import { getCurrentUsername } from "@api/client"

import { states } from "@assets/themes"
import queryClient from "@queries/queryClient"

import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

const FollowButton = ({user, disabled=false}) => {
    const { t } = useTranslation(null, {keyPrefix: "follow_button"})
  
    const currentUsername = getCurrentUsername()

    const { data: following, isPending: fetchFollowPending } = useQuery({
        queryKey: ["followings", currentUsername, user?.username],
        queryFn: () => getFollow(currentUsername, user?.username),
        enabled: !!user,
    })

    const putMutation = useMutation({
        mutationFn: () => putFollowRequest(user?.username),
        onSuccess: data => {
            if (data.status === "requested") {
                toast.info(t("success_requested", {username: user?.username}))
            } else {
                toast.success(t("success_follow", {username: user?.username}))
            }

            queryClient.setQueryData(["followings", currentUsername, user?.username], data)
        },
        onError: () => {
            toast.error(t("error_follow", {username: user?.username}))
        },
    }) 

    const deleteMutation = useMutation({
        mutationFn: () => deleteFollowRequest(user?.username),
        onSuccess: data => {
            if (following?.status === "requested") {
                toast.success(t("success_cancel", {username: user?.username}))
            } else {
                toast.success(t("success_unfollow", {username: user?.username}))
            }

            queryClient.setQueryData(["followings", currentUsername, user?.username], data)
        },
        onError: () => {
            if (following?.status === "requested") {
                toast.success(t("error_cancel", {username: user?.username}))
            } else {
                toast.success(t("error_unfollow", {username: user?.username}))
            }
        },
    }) 

    const [isHover, setIsHover] = useState(false)

    const followButtonLoading = fetchFollowPending || putMutation.isPending || deleteMutation.isPending
    const followAccpetedOrRequested = following?.status === "accepted" || following?.status === "requested" 

    const handleFollow = async () => {
        if (followButtonLoading || disabled) {
            return
        }

        if (!followAccpetedOrRequested) {
            putMutation.mutate()
            return
        }
        
        deleteMutation.mutate()
    }

    return <Button 
        onClick={handleFollow}
        $loading={followButtonLoading}
        disabled={followButtonLoading || disabled}
        $state={
            following?.status === "accepted" && states.success ||
            following?.status === "requested" && states.link ||
            states.text
        }
        $form={isHover && followAccpetedOrRequested ? buttonForms.filled : buttonForms.outlined}

        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
    > 
        {
            following?.status === "requested" && t("button_requested") ||
            following?.status === "accepted" && t("button_accepted") ||
            t("button_follow") 
        }
    </Button>
}

export default FollowButton
