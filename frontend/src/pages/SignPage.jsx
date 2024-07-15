import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom"

import Brand, {Box as BrandTitle} from "@components/sign/Brand"
import Showcase from "@components/sign/Showcase"
import SignForm from "@components/sign/SignForm"

import generateActivities from "@components/sign/activities"

import { getEmojis } from "@api/social.api"

import styled from "styled-components"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

const SignPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [activities, setActivities] = useState([])

    useEffect(() => {
        const flag = searchParams.get("flag")
        switch (flag) {
            case "401":
                toast.error("Please sign in again.", {toastId: "flag401"})
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
        <Link to="/">
            <Brand />
        </Link>
        <Showcase activities={activities} />
        <SignForm />
    </Root>
}

const Root = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;

    background-color: ${p => p.theme.frontSignPageBackgroundColor};

    display: grid;
    grid-template-columns: 1.75fr 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px; 

    ${BrandTitle} {
        position: absolute;

        top: 2rem;
        left: 2rem;
    }

    @media screen and (max-width: 800px) {
        & {
            display: flex;
        }

        ${BrandTitle} {
            color: black;
        }
    }
`

export default SignPage