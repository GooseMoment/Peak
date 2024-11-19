import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import styled from "styled-components"

import LogDetails from "@components/social/logDetails/LogDetails"

import MildButton from "@/components/common/MildButton"

const SocialDailyPage = () => {
    const { username } = useParams()
    const navigate = useNavigate()

    const initialDate = new Date()
    initialDate.setHours(0, 0, 0, 0)
    const [selectedDate, setSelectedDate] = useState(initialDate.toISOString())

    const goBack = () => {
        navigate(-1)
    }

    return (
        <Frame>
            <BackButton onClick={goBack}> go back</BackButton>
            <LogDetails
                username={username.slice(1)}
                selectedDate={selectedDate}
            />
        </Frame>
    )
}

const Frame = styled.div`
    display: flex;
    flex-direction: column;
`

const BackButton = styled(MildButton)``

export default SocialDailyPage
