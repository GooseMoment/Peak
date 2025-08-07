import { type SetStateAction, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DailyContainer from "@components/social/DailyContainer"

import { useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"

const SocialDailyPage = () => {
    const navigate = useNavigate()
    const { username: usernameWithAt, date: dateISO } = useParams()
    const tz = useClientTimezone()

    useEffect(() => {
        if (usernameWithAt!.at(0) !== "@") {
            navigate("/app/social/daily/@" + usernameWithAt)
        }
    }, [usernameWithAt, navigate])

    const username = usernameWithAt!.slice(1)
    const date = DateTime.fromISO(dateISO!, {
        zone: tz,
    })

    useEffect(() => {
        const today = DateTime.now()
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .setZone(tz)

        if (!dateISO) {
            navigate(`/app/social/daily/${usernameWithAt}/${today.toISODate()}`)
            return
        }

        const dateISOPurified = date.toISODate()
        if (!dateISOPurified) {
            navigate(`/app/social/daily/${usernameWithAt}/${today.toISODate()}`)
            return
        } else if (dateISO !== dateISOPurified) {
            navigate(`/app/social/daily/${usernameWithAt}/${dateISOPurified}`)
            return
        }
    }, [dateISO])

    const setDate = (action: SetStateAction<DateTime>) => {
        const newDate = typeof action === "function" ? action(date) : action
        navigate(`/app/social/daily/${usernameWithAt}/${newDate.toISODate()}`)
    }

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
