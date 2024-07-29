import Button from "@components/common/Button"
import { deleteFollowRequest, getFollow, putFollowRequest } from "@api/social.api"
import { getCurrentUsername } from "@api/client"

import queryClient from "@queries/queryClient"

import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

const FollowButton = ({user, disabled=false}) => {
    const currentUsername = getCurrentUsername()

    const { data: following, isPending: fetchFollowPending } = useQuery({
        queryKey: ["follow", currentUsername, user?.username],
        queryFn: () => getFollow(currentUsername, user?.username),
        enabled: user !== undefined,
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

    const followButtonLoading = fetchFollowPending || putMutation.isPending || deleteMutation.isPending

    const handleFollow = async () => {
        if (followButtonLoading || disabled) {
            return
        }

        if (!following) {
            putMutation.mutate()
            return
        }
        
        deleteMutation.mutate()
    }

    return <Button 
        onClick={handleFollow}
        $loading={followButtonLoading}
        disabled={followButtonLoading || disabled}> 

        {following ? (
            following.status === "requested" ? "Requested" : "Unfollow"
        ) : "Follow"}
    </Button>
}

export default FollowButton
