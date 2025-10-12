import { FormEvent } from "react"
import { Link, useSearchParams } from "react-router-dom"

import { useMutation, useQuery } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import Input from "@components/common/Input"
import ErrorLayout from "@components/errors/ErrorLayout"
import {
    Content,
    FullLoader,
    LinkText,
    Links,
    Text,
    Title,
    VerifiedMessage,
} from "@components/sign/common"

import {
    ResendVerificationEmailError,
    resendVerificationEmail,
    verifyEmailVerificationToken,
} from "@api/auth.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export const EmailVerificationResendForm = () => {
    const { t } = useTranslation("translation", {
        keyPrefix: "email_verification",
    })

    const mutation = useMutation<
        void,
        ResendVerificationEmailError,
        { email: string }
    >({
        mutationFn: ({ email }: { email: string }) =>
            resendVerificationEmail(email),
        onSuccess: () => {
            toast.success(t("resend_success"))
        },
        onError: (err) => {
            if (err.code === "RATE_LIMIT_EXCEEDED") {
                const seconds = err.seconds || 0
                const minutes = Math.floor(seconds / 60) + 1

                return toast.error(t(err.code, { minutes }))
            }

            return toast.error(t(err.code))
        },
    })

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        mutation.mutate({ email })
    }

    return (
        <>
            <Title>{t("resend_title")}</Title>
            <Content>
                <form onSubmit={onSubmit}>
                    <Input
                        icon="mail"
                        name="email"
                        placeholder={t("placeholder_email")}
                        type="email"
                        required
                        disabled={mutation.isPending}
                    />
                    <ButtonGroup $justifyContent="right" $margin="1em 0">
                        <Button
                            loading={mutation.isPending}
                            type="submit"
                            disabled={mutation.isPending}>
                            {t("button_submit")}
                        </Button>
                    </ButtonGroup>
                </form>
                <Text>{t("resend_other_cases")}</Text>
                <Text>{t("resend_known_issues")}</Text>
                <Links>
                    <Link to="/sign/in">
                        <LinkText>
                            <FeatherIcon icon="log-in" />
                            {t("link_sign")}
                        </LinkText>
                    </Link>
                </Links>
            </Content>
        </>
    )
}

export const EmailVerificationForm = () => {
    const { t } = useTranslation("translation", {
        keyPrefix: "email_verification",
    })

    const [searchParams] = useSearchParams()

    const token = searchParams.get("token")

    const {
        data: email,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["email_verifications", token],
        queryFn: () => verifyEmailVerificationToken(token!),
        enabled: !!token,
        refetchOnWindowFocus: false,
    })

    if (isPending) {
        return <FullLoader />
    }

    if (isError) {
        return <ErrorLayout code="?_?" text={t("invalid_access")} />
    }

    return (
        <>
            <Title>{t("verified_title")}</Title>
            <Content>
                <VerifiedMessage>{t("verified", { email })}</VerifiedMessage>
                <Links>
                    <Link to="/sign/in">
                        <LinkText>
                            <FeatherIcon icon="log-in" />
                            {t("link_sign")}
                        </LinkText>
                    </Link>
                </Links>
            </Content>
        </>
    )
}
