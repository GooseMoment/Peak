import Button from "@components/common/Button"
import FollowsCount from "@components/users/FollowsCount"

import { deleteFollowRequest, putFollowRequest } from "@api/social.api"
import { getCurrentUsername } from "@api/client"
import queryClient from "@queries/queryClient"

import styled from "styled-components"
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"

const UserProfileHeader = ({user, isMine, following, fetchFollowPending}) => {

    const putMutation = useMutation({
        mutationFn: () => putFollowRequest(user.username),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["follow", getCurrentUsername(), user.username]}),
        onError: () => toast.error(`Cannot follow @${user.username}.`)
    }) 

    const deleteMutation = useMutation({
        mutationFn: () => deleteFollowRequest(user.username),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["follow", getCurrentUsername(), user.username]}),
        onError: () => toast.error(`Cannot cancel request to or unfollow @${user.username}.`)
    }) 

    const followButtonLoading = fetchFollowPending || putMutation.isPending || deleteMutation.isPending

    const handleFollow = async () => {
        if (followButtonLoading) {
            return
        }

        if (!following) {
            putMutation.mutate()
            return
        }
        
        deleteMutation.mutate()
    }

    return <>
        <Banner />
        <Profile>
            <ProfileImg src={user.profile_img} />
            <ProfileTexts>
                <Names>
                    <DisplayName>{user.display_name}</DisplayName>
                    <Username>@{user.username}</Username>
                </Names>
                <Datas>
                    <FollowsCount followers={user.followers_count} followings={user.followings_count} />
                </Datas>
            </ProfileTexts>
            <ProfileButtons>
                {isMine ? 
                    <a href="#/settings/account"><Button>Edit Profile</Button></a> 
                    : <Button 
                        onClick={handleFollow}
                        $loading={followButtonLoading}
                        disabled={followButtonLoading}> 

                        {following ? (
                            following.status === "requested" ? "Requested" : "Unfollow"
                        ) : "Follow"}
                    </Button>
                }
            </ProfileButtons>
        </Profile>
    </>

}

const Banner = styled.div`
    background-color: ${p => p.theme.grey};
    height: 15em;
    width: 100vw;
    margin: -3em -10em;
`

const Profile = styled.div`
    position: relative;
    box-sizing: border-box;
    margin-top: -5em;

    display: flex;
    gap: 2em;
`

const ProfileImg = styled.img`
    border-radius: 50%;
    height: 10em;
    aspect-ratio: 1/1;
`

const ProfileTexts = styled.div`
    padding: 1em 0;

    display: flex;
    flex-direction: column;
    justify-content: start;

    gap: 1.75em;

    flex-grow: 3;
`

const Names = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const DisplayName = styled.h1`
    font-weight: 700;
    font-size: 2em;
`

const Username = styled.div``

const Datas = styled.div``

const ProfileButtons = styled.div`
    padding: 1.25em 0;

    display: flex;    
    justify-content: flex-start;
    align-items: self-start;
`

export default UserProfileHeader
