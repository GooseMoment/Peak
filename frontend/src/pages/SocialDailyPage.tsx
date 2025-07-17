import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import DailyUserProfile from "@components/social/DailyUserProfile"
import DateBar from "@components/social/common/DateBar"
import LogDetails from "@components/social/logDetails/LogDetails"

import { DateTime } from "luxon"

const SocialDailyPage = () => {
    const navigate = useNavigate()
    const { username: usernameWithAt } = useParams()
    const location = useLocation()
    const { selectedDate: receivedDate } = location.state || {}

    useEffect(() => {
        if (usernameWithAt!.at(0) !== "@") {
            navigate("/app/social/daily/@" + usernameWithAt)
        }
    }, [usernameWithAt, navigate])

    const username = usernameWithAt!.slice(1)

    const [selectedDate, setSelectedDate] = useState(
        receivedDate ||
            DateTime.now()
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                .toISO(),
    )

    return (
        <>
            <DailyUserProfile username={username} back />
            <DateBar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
            <LogDetails username={username} selectedDate={selectedDate} />
        </>
    )
}

export default SocialDailyPage
