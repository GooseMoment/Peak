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
            toast.success("인증 메일을 다시 전송했습니다. 메일함 또는 스팸함을 확인하세요.")
        },
        onError: e => {
            if (e.response.status === 425) {
                const seconds = e.response.data.seconds
                const minutes = Math.floor(seconds / 60) + 1

                return toast.error(`약 ${minutes}분 후 다시 시도하십시오.`)
            } else if (e.response.status === 400) {
                return toast.error("메일 형식이 올바르지 않습니다.")
            }
            
            return toast.error("오류가 발생했습니다.")
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
                <Text>이메일 인증 메일을 받지 못한 경우, 다시 요청할 수 있습니다.</Text>
                <form onSubmit={onSubmit}>
                    <Input icon={<Mail />} name="email" placeholder="이메일 주소 입력" type="email" required disabled={mutation.isPending} />
                    <ButtonGroup $justifyContent="right" $margin="1em 0">
                        <Button $loading={mutation.isPending} type="submit" disabled={mutation.isPending}>제출</Button>
                    </ButtonGroup>
                </form>
                <Text>만약 이미 인증되었거나, 등록되지 않은 이메일이라면 다른 메일이 전송됩니다.</Text>
                <Text>Outlook 등의 이메일 서비스에서는 스팸으로 간주되어 전송이 불가합니다. 해당 경우에는 다른 주소로 가입하여 주십시오.</Text>
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
