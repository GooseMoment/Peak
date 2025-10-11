import { Suspense, useEffect, useState } from "react"
import { Link, Outlet, useSearchParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import Brand, { Box as BrandTitle } from "@components/sign/Brand"
import Showcase from "@components/sign/Showcase"
import generateActivities from "@components/sign/activities"

import { getEmojis } from "@api/social.api"

import { ifMobile, ifTablet } from "@utils/useScreenType"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const SignPage = () => {
    const { t } = useTranslation(null, { keyPrefix: "sign" })
    const [searchParams] = useSearchParams()
    const [activities, setActivities] = useState([])

    useEffect(() => {
        const flag = searchParams.get("flag")
        switch (flag) {
            case "401":
                toast.error(t("sign_in_again"), { toastId: "flag401" })
                break
        }
    }, [searchParams, t])

    const {
        data: serverEmojis,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ["emojis"],
        queryFn: () => getEmojis(),
        staleTime: 1000 * 60 * 60 * 5,
    })

    useEffect(() => {
        if (isFetching) {
            return
        }

        if (isError) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- this line will be deleted at PR #553
            setActivities(generateActivities(null))
            return
        }

        setActivities(generateActivities(serverEmojis))
    }, [serverEmojis, isError, isFetching])

    return (
        <Root>
            <Link to="/">
                <Brand />
            </Link>
            <Showcase activities={activities} />
            <ContentBox>
                <Suspense key="sign-page" fallback={<LoaderCircleFull />}>
                    <Outlet />
                </Suspense>
            </ContentBox>
        </Root>
    )
}

const Root = styled.div`
    position: relative;
    width: 100%;
    height: 100dvh;

    background-color: ${(p) => p.theme.introBackgroundColor};

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

    ${ifTablet} {
        display: flex;

        ${BrandTitle} {
            color: ${(p) => p.theme.textColor};
        }
    }
`

const ContentBox = styled.section`
    display: flex;
    overflow-y: scroll;
    justify-content: center;
    flex-direction: column;
    gap: 5rem;

    padding: 2.25rem;
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};

    grid-area: 1 / 2 / 2 / 3;

    font-size: 1rem;

    ${ifTablet} {
        width: 100%;
        padding: 2.25rem 5.5em;
    }

    ${ifMobile} {
        padding: 2.25rem;
    }
`

export default SignPage
