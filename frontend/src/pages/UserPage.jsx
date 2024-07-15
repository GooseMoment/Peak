import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Section } from "@components/users/Section"
import UserProfileHeader from "@components/users/UserProfileHeader"
import Bio from "@components/users/Bio"

import { getUserByUsername } from "@api/users.api"

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

    const { data: user, isPending } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUserByUsername(username),
    })

    if (isPending) {
        return "loading"
    }

    return <>
        <UserProfileHeader user={user} />
        <Section />
        <Bio bio={user.bio} />
    </>
}

export default UserPage
