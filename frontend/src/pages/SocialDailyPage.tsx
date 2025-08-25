import { useEffect } from "react"
import { generatePath, useNavigate, useParams } from "react-router-dom"

import DailyContainer from "@components/social/DailyContainer"

import useDateParamState from "@utils/useDateParamState"

import { DateTime } from "luxon"

const SocialDailyPage = () => {
    const navigate = useNavigate()
    const { username: usernameWithAt } = useParams()

    useEffect(() => {
        if (usernameWithAt!.at(0) !== "@") {
            navigate("/app/social/daily/@" + usernameWithAt)
        }
    }, [usernameWithAt, navigate])

    const username = usernameWithAt!.slice(1)

    const [date, setDate] = useDateParamState({
        navigate: (value: DateTime, fallback: boolean) => {
            navigate(
                generatePath("/app/social/daily/:username/:date", {
                    username: usernameWithAt!,
                    date: value.toISODate(),
                }),
                {
                    replace: fallback,
                },
            )
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
