import { FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import Input from "@components/common/Input"
import {
    Content,
    Form,
    LinkText,
    Links,
    Text,
    Title,
} from "@components/sign/common"

import {
    PasswordRecoveryError,
    patchPasswordWithPasswordRecoveryToken,
    requestPasswordRecoveryToken,
} from "@api/auth.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export function PasswordRecoveryRequestForm() {
    const { t } = useTranslation("translation", {
        keyPrefix: "password_recovery",
    })

    const mutation = useMutation<
        void,
        PasswordRecoveryError,
        { email: string }
    >({
        mutationFn: ({ email }: { email: string }) =>
            requestPasswordRecoveryToken(email),
        onSuccess: () => {
            toast.success(t("request_success"))
        },
        onError: (err) => {
            if (err.code === "RATE_LIMIT_EXCEEDED") {
                return toast.error(t(err.code, { minutes: 60 }))
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
            <Title>{t("request_title")}</Title>
            <Content>
                <Text>{t("request_description")}</Text>
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
                <Links>
                    <Link to="/sign/in">
                        <LinkText>
                            <FeatherIcon icon="log-in" />
                            {t("link_sign_in")}
                        </LinkText>
                    </Link>
                </Links>
            </Content>
        </>
    )
}

export function PasswordRecoveryForm() {
    const { t } = useTranslation("translation", {
        keyPrefix: "password_recovery",
    })
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const token = searchParams.get("token")

    const mutation = useMutation<
        void,
        PasswordRecoveryError,
        { token: string; password: string }
    >({
        mutationFn: ({
            token,
            password,
        }: {
            token: string
            password: string
        }) => patchPasswordWithPasswordRecoveryToken(token, password),
        onSuccess: () => {
            toast.success(t("recovery_success"))
            navigate("/sign/in")
        },
        onError: (err) => {
            return toast.error(t(err.code))
        },
    })

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const password = formData.get("password")
        const passwordAgain = formData.get("password_again")

        if (typeof password !== "string" || typeof passwordAgain !== "string") {
            return toast.error(t("UNKNOWN_ERROR"))
        }

        if (password.length < 8) {
            return toast.error(t("recovery_error_password_length"))
        }

        if (password != passwordAgain) {
            return toast.error(t("recovery_error_password_unmatch"))
        }

        if (!token) {
            return toast.error(t("TOKEN_REQUIRED"))
        }

        mutation.mutate({ token, password })
    }

    return (
        <>
            <Title>{t("recovery_title")}</Title>
            <Form onSubmit={onSubmit}>
                <Text>{t("recovery_description")}</Text>
                <Input
                    icon="key"
                    name="password"
                    placeholder={t("placeholder_password")}
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={mutation.isPending}
                />
                <Input
                    icon="rotate-cw"
                    name="password_again"
                    placeholder={t("placeholder_password_again")}
                    type="password"
                    autoComplete="new-password"
                    required
                    disabled={mutation.isPending}
                />
                <ButtonGroup $justifyContent="right" $margin="1em 0">
                    <Button
                        loading={mutation.isPending}
                        type="submit"
                        disabled={mutation.isPending}>
                        {t("button_set")}
                    </Button>
                </ButtonGroup>
            </Form>
        </>
    )
}
