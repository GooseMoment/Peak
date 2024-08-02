import { useSearchParams } from "react-router-dom"

import FullscreenLoader from "@components/common/FullscreenLoader"
import Error from "@components/errors/ErrorLayout"
import Brand from "@components/sign/Brand"
import Button, { ButtonGroup } from "@components/common/Button"
import Input from "@components/sign/Input"
import { resendVerificationEmail, verifyEmail } from "@api/users.api"

import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Mail } from "feather-icons-react"
import { toast } from "react-toastify"

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

    const mutation = useMutation({
        mutationFn: ({email}) => resendVerificationEmail(email),
        onSuccess: () => {
            toast.success(t("resend_success"))
        },
        onError: e => {
            if (e.response.status === 425) {
                const seconds = e.response.data.seconds
                const minutes = Math.floor(seconds / 60) + 1

                return toast.error(t("resend_error_limit", {minutes}))
            } else if (e.response.status === 400) {
                return toast.error(t("resend_error_bad_request"))
            }
            
            return toast.error(t("resend_error_any"))
        }
    })

    const onSubmit = e => {
        e.preventDefault()
        const email = e.target.email.value
        mutation.mutate({email})
    }

    if (!token) {
        return <Frame>
            <Link to="/"><Brand /></Link> 
            <Content>
                <Text>{t("resend_you_can_request")}</Text>
                <form onSubmit={onSubmit}>
                    <Input icon={<Mail />} name="email" placeholder={t("placeholder_email")} type="email" required disabled={mutation.isPending} />
                    <ButtonGroup $justifyContent="right" $margin="1em 0">
                        <Button $loading={mutation.isPending} type="submit" disabled={mutation.isPending}>{t("button_submit")}</Button>
                    </ButtonGroup>
                </form>
                <Text>{t("resend_other_cases")}</Text>
                <Text>{t("resend_known_issues")}</Text>
                <Link to="/sign"><Button>{t("link_sign")}</Button></Link>
            </Content>
        </Frame>
    }

    if (isPending) {
        return <FullscreenLoader />
    }

    if (isError) {
        return <Error code="?_?" text={t("invalid_access")} />
    }

    return <Frame>
        <Brand />
        <Content>
            <Text>{t("verified", {email})} </Text>
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

const Text = styled.p`
    line-height: 1.3;
`

export default EmailVerificationPage
