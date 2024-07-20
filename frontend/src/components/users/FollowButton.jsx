import { useState } from "react"

import Button, { buttonForms } from "@components/common/Button"
import { deleteFollowRequest, getFollow, putFollowRequest } from "@api/social.api"
import { getCurrentUsername } from "@api/client"

import { states } from "@assets/themes"
import queryClient from "@queries/queryClient"

import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

const FollowButton = ({user}) => {
    const currentUsername = getCurrentUsername()

    const { data: following, isPending: fetchFollowPending } = useQuery({
        queryKey: ["follow", currentUsername, user?.username],
        queryFn: () => getFollow(currentUsername, user?.username),
        enabled: !!user,
    })

    const putMutation = useMutation({
        mutationFn: () => putFollowRequest(user?.username),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["follow", currentUsername, user?.username]}),
        onError: () => toast.error(`Cannot follow @${user?.username}.`)
    }) 

    const deleteMutation = useMutation({
        mutationFn: () => deleteFollowRequest(user?.username),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["follow", currentUsername, user?.username]}),
        onError: () => toast.error(`Cannot cancel request to or unfollow @${user?.username}.`),
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
            following?.status === "requested" && "Requested" ||
            following?.status === "accepted" && "Following" ||
            "Follow"
        }
    </Button>
}

export default FollowButton
