import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"

import Error from "@components/errors/ErrorLayout"
import Bio from "@components/users/Bio"
import ProjectList from "@components/users/ProjectList"
import Requests from "@components/users/Requests"
import UserProfileHeader from "@components/users/UserProfileHeader"

import { getCurrentUsername } from "@api/client"
import { getProjectListByUser } from "@api/projects.api"
import { type Block } from "@api/social"
import { getBlock, getFollow } from "@api/social.api"
import { getUserByUsername } from "@api/users.api"

import { useTranslation } from "react-i18next"

const UserPage = () => {
    const navigate = useNavigate()
    const { username: usernameWithAt } = useParams()

    useEffect(() => {
        if (usernameWithAt!.at(0) !== "@") {
            navigate("/app/users/@" + usernameWithAt)
        }
    }, [usernameWithAt])

    // usernameWithAt shouldn't be undefined
    const username = usernameWithAt!.slice(1)
    const currentUsername = getCurrentUsername()
    const isMine = currentUsername === username

    const followingQuery = useQuery({
        queryKey: ["followings", username, currentUsername],
        queryFn: () => getFollow(username, currentUsername),
        enabled: currentUsername !== username,
    })

    const blockQuery = useQuery<Block | null>({
        queryKey: ["blocks", getCurrentUsername(), username],
        queryFn() {
            return getBlock(username)
        },
        enabled: currentUsername !== username,
    })

    const {
        data: user,
        isLoading: userLoading,
        isError: userError,
    } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUserByUsername(username),
    })

    const { data: projects, isLoading: projectLoading } = useQuery({
        queryKey: ["userProjects", username],
        queryFn: () => getProjectListByUser(username),
    })

    const { t } = useTranslation("translation", { keyPrefix: "users" })

    if (userError) {
        return (
            <Error height="100%" code="404" text={t("error_user_not_found")} />
        )
    }

    return (
        <>
            <UserProfileHeader
                user={user}
                followingYou={followingQuery.data}
                block={blockQuery.data}
                isLoading={
                    userLoading ||
                    followingQuery.isLoading ||
                    blockQuery.isLoading
                }
                isMine={isMine}
            />
            {user && followingQuery.data?.status === "requested" && (
                <Requests user={user} />
            )}
            <Bio bio={user?.bio} isLoading={userLoading} isMine={isMine} />
            <ProjectList
                projects={projects}
                isLoading={projectLoading}
                isMine={isMine}
            />
        </>
    )
}

export default UserPage
