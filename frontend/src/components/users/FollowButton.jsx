import { useState } from "react"

import Button, { buttonForms } from "@components/common/Button"
import { deleteFollowRequest, getFollow, putFollowRequest } from "@api/social.api"
import { getCurrentUsername } from "@api/client"

import { states } from "@assets/themes"
import queryClient from "@queries/queryClient"

import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Trans, useTranslation } from "react-i18next"

const FollowButton = ({user}) => {
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
                toast.info(<Trans t={t} i18nKey="success_requested" values={{username: user?.username}} />)
            } else {
                toast.success(<Trans t={t} i18nKey="success_follow" values={{username: user?.username}} />)
            }

            queryClient.setQueryData(["followings", currentUsername, user?.username], data)
        },
        onError: () => {
            toast.error(<Trans t={t} i18nKey="error_follow" values={{username: user?.username}} />)
        },
    }) 

    const deleteMutation = useMutation({
        mutationFn: () => deleteFollowRequest(user?.username),
        onSuccess: data => {
            if (following?.status === "requested") {
                toast.success(<Trans t={t} i18nKey="success_cancel" values={{username: user?.username}} />)
            } else {
                toast.success(<Trans t={t} i18nKey="success_unfollow" values={{username: user?.username}} />)
            }

            queryClient.setQueryData(["followings", currentUsername, user?.username], data)
        },
        onError: () => {
            if (following?.status === "requested") {
                toast.success(<Trans t={t} i18nKey="error_cancel" values={{username: user?.username}} />)
            } else {
                toast.success(<Trans t={t} i18nKey="error_unfollow" values={{username: user?.username}} />)
            }
        },
    }) 

    const [isHover, setIsHover] = useState(false)

    const followButtonLoading = fetchFollowPending || putMutation.isPending || deleteMutation.isPending
    const followAccpetedOrRequested = following?.status === "accepted" || following?.status === "requested" 

    const handleFollow = async () => {
        if (followButtonLoading) {
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
        disabled={followButtonLoading}
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
