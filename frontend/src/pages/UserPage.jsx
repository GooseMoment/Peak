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
import { getFollow } from "@api/social.api"
import { getUserByUsername } from "@api/users.api"

import { useTranslation } from "react-i18next"

const UserPage = () => {
    const navigate = useNavigate()
    const { username: usernameWithAt } = useParams()

    useEffect(() => {
        if (usernameWithAt.at(0) !== "@") {
            navigate("/app/users/@" + usernameWithAt)
        }
    }, [usernameWithAt])

    const username = usernameWithAt.slice(1)
    const currentUsername = getCurrentUsername()
    const isMine = currentUsername === username

    const { data: followingYou } = useQuery({
        queryKey: ["followings", username, currentUsername],
        queryFn: () => getFollow(username, currentUsername),
        enabled: currentUsername !== username,
    })

    const {
        data: user,
        isPending: userPending,
        isError: userError,
    } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUserByUsername(username),
        retry: (count, err) => {
            if (err.response.status === 404) {
                return false
            }

            return count < 3
        },
    })

    const { data: projects, isPending: projectPending } = useQuery({
        queryKey: ["userProjects", username],
        queryFn: () => getProjectListByUser(username),
    })

    const { t } = useTranslation(null, { keyPrefix: "users" })

    if (userError) {
        return (
            <Error height="100%" code="404" text={t("error_user_not_found")} />
        )
    }

    return (
        <>
            <UserProfileHeader
                user={user}
                followingYou={followingYou}
                isPending={userPending}
                isMine={isMine}
            />
            {user && followingYou?.status === "requested" && (
                <Requests user={user} />
            )}
            <Bio bio={user?.bio} isPending={userPending} isMine={isMine} />
            <ProjectList
                projects={projects}
                isPending={projectPending}
                isMine={isMine}
            />
        </>
    )
}

export default UserPage
