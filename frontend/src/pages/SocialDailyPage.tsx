import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DailyContainer from "@components/social/DailyContainer"

import { useClientTimezone } from "@utils/clientSettings"
import useParamState from "@utils/useParamState"

import { DateTime } from "luxon"

const SocialDailyPage = () => {
    const navigate = useNavigate()
    const { username: usernameWithAt } = useParams()
    const tz = useClientTimezone()

    useEffect(() => {
        if (usernameWithAt!.at(0) !== "@") {
            navigate("/app/social/daily/@" + usernameWithAt)
        }
    }, [usernameWithAt, navigate])

    const username = usernameWithAt!.slice(1)

    const [date, setDate] = useParamState<DateTime>({
        name: "date",
        fallback: () =>
            DateTime.now()
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                .setZone(tz),
        convert: (param) => {
            if (!param) {
                return
            }

            const date = DateTime.fromISO(param, { zone: tz })
            return date.isValid ? date : undefined
        },
        navigate: (value: DateTime) => {
            navigate(`/app/social/daily/${usernameWithAt}/${value.toISODate()}`)
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
