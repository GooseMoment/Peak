import { useState } from "react"
import { useParams } from "react-router-dom"

import LogDetails from "@components/social/logDetails/LogDetails"

const SocialDailyPage = () => {
    const { username } = useParams()

    const initialDate = new Date()
    initialDate.setHours(0, 0, 0, 0)
    const [selectedDate, setSelectedDate] = useState(initialDate.toISOString())

    return (
        <LogDetails username={username.slice(1)} selectedDate={selectedDate} />
    )
}

export default SocialDailyPage
