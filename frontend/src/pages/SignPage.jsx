import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import Brand from "@components/sign/Brand"
import Showcase from "@components/sign/Showcase"
import SignForm from "@components/sign/SignForm"

import generateActivities from "@components/sign/activities"

import notify from "@utils/notify"
import { getEmojis } from "@api/social.api"

import styled from "styled-components"
import { useQuery } from "@tanstack/react-query"

const SignPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [activities, setActivities] = useState([])

    useEffect(() => {
        const flag = searchParams.get("flag")
        switch (flag) {
            case "401":
                notify.error("Please sign in again.", {toastId: "flag401"})
                break
        }
        setSearchParams({})
    }, [])

    const { data: serverEmojis, isError, isFetching } = useQuery({
        queryKey: ["emojis"],
        queryFn: () => getEmojis(),
        staleTime: 1000 * 60 * 60 * 5,
    })

    useEffect(() => {
        if (isFetching) {
            return
        }

        if (isError) {
            setActivities(generateActivities(null))
            return
        }

        setActivities(generateActivities(serverEmojis))
    }, [serverEmojis])

    return <Root>
        <Brand />
        <Showcase activities={activities} />
        <SignForm />
    </Root>
}

const Root = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;

    background-color: #FFD7C7;

    display: grid;
    grid-template-columns: 1.75fr 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px; 

    @media screen and (max-width: 800px) {
    & {
        display: flex;
    }
}
`

export default SignPage