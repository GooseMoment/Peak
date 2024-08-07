import { useQuery } from "@tanstack/react-query"

import PageTitle from "@components/common/PageTitle"

import { getMe } from "@api/users.api"

const HomePage = () => {
    const { data: me, isPending } = useQuery({
        queryKey: ["users", "me"],
        queryFn: () => getMe(),
    })

    if (isPending) {
        return <div>Loading...</div>
    }

    return (
        <>
            <PageTitle>Good morning, @{me.username}</PageTitle>
        </>
    )
}

export default HomePage
