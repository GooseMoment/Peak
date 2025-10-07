import { useEffect, useState } from "react"
import { generatePath, useNavigate, useParams } from "react-router-dom"

import DailyContainer from "@components/social/DailyContainer"

import useDateParamState from "@utils/useDateParamState"

import { DateTime } from "luxon"

const SocialDailyPage = () => {
    const navigate = useNavigate()
    const { username: usernameWithAt } = useParams()

    const search = new URLSearchParams(location.search)
    const fromParam = search.get("from")

    const [initialFrom] = useState(fromParam)

    useEffect(() => {
        if (usernameWithAt!.at(0) !== "@") {
            navigate("/app/social/daily/@" + usernameWithAt)
        }
    }, [usernameWithAt, navigate])

    const username = usernameWithAt!.slice(1)

    const [date, setDate] = useDateParamState({
        navigate: (value: DateTime, fallback: boolean) => {
            let path = generatePath("/app/social/daily/:username/:date", {
                username: usernameWithAt!,
                date: value.toISODate(),
            })

            if (initialFrom) {
                path += `?from=${initialFrom}`
            }

            navigate(path, { replace: fallback })
        },
    })

    return (
        <DailyContainer
            username={username}
            date={date}
            setDate={setDate}
            standalone
        />
    )
}

export default SocialDailyPage
