import { useSearchParams } from "react-router-dom"

import FullscreenLoader from "@components/common/FullscreenLoader"
import Error from "@components/errors/ErrorLayout"
import Brand from "@components/sign/Brand"
import { verifyEmail } from "@api/users.api"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Button from "@/components/common/Button"

const EmailVerificationPage = () => {
    const { t } = useTranslation(null, {keyPrefix: "email_verification"})

    const [searchParams, ] = useSearchParams()

    const token = searchParams.get("token")

    const { data: email, isPending, isError } = useQuery({
        queryKey: ["email_verifications", token],
        queryFn: () => verifyEmail(token),
        enabled: !!token,
        refetchOnWindowFocus: false,
        retry: (count, err) => {
            if (err.response.status === 400) {
                return false
            }

            return count < 3
        }
    })

    if (isPending) {
        return <FullscreenLoader />
    }

    if (isError) {
        return <Error code="?_?" text={t("invalid_access")} />
    }

    return <Frame>
        <Brand />
        <Content>
            <p>{t("verified", {email})} </p>
            <Link to="/sign"><Button>{t("link_sign")}</Button></Link>
        </Content>
    </Frame>
}

const Frame = styled.div`
    display: flex;
    box-sizing: border-box;
    height: 100dvh;
    align-items: center;

    flex-direction: column;
    padding: 2em;
    padding-top: 4em;
    gap: 2em;
`

const Content = styled.main`
    color: ${p => p.theme.textColor};

    display: flex;
    justify-content: center;
    align-items: center;

    flex-direction: column;

    gap: 2em;
`

export default EmailVerificationPage
