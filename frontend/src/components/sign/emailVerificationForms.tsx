import { FormEvent } from "react"
import { Link, useSearchParams } from "react-router-dom"

import { useMutation, useQuery } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import Input from "@components/common/Input"
import { LoaderCircleFull } from "@components/common/LoaderCircle"
import ErrorLayout from "@components/errors/ErrorLayout"
import {
    Content,
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
                const minutes = Math.ceil(err.seconds / 60)

                return toast.error(t(err.code, { minutes }))
            }

            return toast.error(t(err.code))
        },
    })

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        if (typeof email !== "string") {
            return toast.error(t("UNKNOWN_ERROR"))
        }
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

    if (!token || isError) {
        return <ErrorLayout code="?_?" text={t("invalid_access")} />
    }

    if (isPending) {
        return <LoaderCircleFull />
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
