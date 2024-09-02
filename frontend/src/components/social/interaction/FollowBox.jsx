import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import { getCurrentUsername } from "@api/client"
import {
    deleteFollowRequest,
    getFollow,
    patchFollowRequest,
    putFollowRequest,
} from "@api/social.api"

import queryClient from "@/queries/queryClient"
import { toast } from "react-toastify"

const FollowBox = ({ user }) => {
    const me = getCurrentUsername()

    const { data: follow } = useQuery({
        queryKey: ["follow", user.username],
        queryFn: () => getFollow(me, user.username),
        enabled: !!user,
    })

    const followMutation = useMutation({
        mutationFn: (action) => {
            if (action === "request") {
                return putFollowRequest(user.username)
            } else if (action === "cancel") {
                return deleteFollowRequest(user.username)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["follow", user.username],
            })
        },
        onError: (e) => {
            toast.error(e)
        },
    })

    const { data: followed } = useQuery({
        queryKey: ["followed", user.username],
        queryFn: () => getFollow(user.username, me),
        enabled: !!user,
    })

    const followedMutation = useMutation({
        mutationFn: (action) => {
            if (action === "accept") {
                return patchFollowRequest(user.username, true)
            } else if (action === "reject") {
                return patchFollowRequest(user.username, false)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["followed", user.username],
            })
        },
        onError: (e) => {
            toast.error(e)
        },
    })

    // 404 -> follow: False

    const handleFollow = () => {
        if (follow.status === 204) {
            followMutation.mutate("request")
        } else {
            followMutation.mutate("cancel")
        }
    }

    const handleRequest = (action) => {
        followedMutation.mutate(action)
    }

    return (
        <Box>
            {followed?.status === 200 &&
                followed.data.status === "requested" && (
                    <>
                        <FollowAcceptButton
                            onClick={() => handleRequest("reject")}>
                            {"Reject"}
                        </FollowAcceptButton>
                        <FollowAcceptButton
                            onClick={() => handleRequest("accept")}>
                            {"Accept"}
                        </FollowAcceptButton>
                    </>
                )}
            {follow && (
                <FollowRequestButton onClick={handleFollow}>
                    {follow.status === 204
                        ? "Follow"
                        : follow?.data.status === "requested"
                          ? "Requested"
                          : "Following"}
                </FollowRequestButton>
            )}
        </Box>
    )
}

const Box = styled.div`
    padding-right: 2em;

    display: flex;
    justify-content: right;
    align-items: center;

    gap: 1em;
`

const FollowAcceptButton = styled(MildButton)`
    width: 6em;
    height: 2em;

    border-radius: 0.5em;
    background-color: #f0f0f0;

    text-align: center;
`

const FollowRequestButton = styled(MildButton)`
    width: 6em;
    height: 2em;

    border-radius: 0.5em;
    background-color: #f0f0f0;

    text-align: center;
`

export default FollowBox
