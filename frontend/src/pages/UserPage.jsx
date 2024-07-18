import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import UserProfileHeader from "@components/users/UserProfileHeader"
import Bio from "@components/users/Bio"
import ProjectList from "@components/users/ProjectList"

import { getUserByUsername } from "@api/users.api"
import { getProjectListByUser } from "@api/projects.api"
import { getCurrentUsername } from "@api/client"

import { useQuery } from "@tanstack/react-query"

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

    const { data: projects } = useQuery({
        queryKey: ["userProjects", username],
        queryFn: () => getProjectListByUser(username),
        enabled: !userPending && !userError,
    })

    if (userError) {
        // TODO: Edit here after building a new error page
        return "UserNotFound!"
    }

    return <>
        <UserProfileHeader user={user} isMine={isMine} />
        <Bio bio={user?.bio} isMine={isMine} />
        <ProjectList projects={projects} isMine={isMine} />
    </>
}

export default UserPage
