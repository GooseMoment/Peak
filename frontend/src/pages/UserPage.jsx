import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"

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
        <PageTitle>Hi {user.display_name}</PageTitle>
    </>
}

export default UserPage