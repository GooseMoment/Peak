import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import UserProfileHeader from "@components/users/UserProfileHeader"
import Bio from "@components/users/Bio"
import ProjectList from "@components/users/ProjectList"

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
    })

    const { data: projects, isPending: projectPending } = useQuery({
        queryKey: ["userProjects", username],
        queryFn: () => getProjectListByUser(username),
    })

    const { t } = useTranslation(null, {keyPrefix: "users"})

    if (userError) {
        // TODO: Edit here after building a new error page
        return t("error_user_not_found")
    }

    return <>
        <UserProfileHeader user={user} isPending={userPending} isMine={isMine} />
        <Bio bio={user?.bio} isPending={userPending} isMine={isMine} />
        <ProjectList projects={projects} isPending={projectPending} isMine={isMine} />
    </>
}

export default UserPage
