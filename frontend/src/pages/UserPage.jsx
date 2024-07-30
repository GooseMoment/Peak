import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import UserProfileHeader from "@components/users/UserProfileHeader"
import Bio from "@components/users/Bio"
import ProjectList from "@components/users/ProjectList"
import Error from "@components/errors/ErrorLayout"

import { getUserByUsername } from "@api/users.api"
import { getProjectListByUser } from "@api/projects.api"
import { getCurrentUsername } from "@api/client"

import { useQuery } from "@tanstack/react-query"
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

    const { data: user, isPending: userPending, isError: userError } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUserByUsername(username),
        retry: (count, err) => {
            if (err.response.status === 404) {
                return false
            }

            return count < 3
        } 
    })

    const { data: projects, isPending: projectPending } = useQuery({
        queryKey: ["userProjects", username],
        queryFn: () => getProjectListByUser(username),
    })

    const { t } = useTranslation(null, {keyPrefix: "users"})

    if (userError) {
        return <Error height="100%" code="404" text={t("error_user_not_found")} />
    }

    return <>
        <UserProfileHeader user={user} isPending={userPending} isMine={isMine} />
        <Bio bio={user?.bio} isPending={userPending} isMine={isMine} />
        <ProjectList projects={projects} isPending={projectPending} isMine={isMine} />
    </>
}

export default UserPage
