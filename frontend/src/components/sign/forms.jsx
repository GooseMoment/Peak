import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import LoaderCircle from "@components/common/LoaderCircle"
import Error from "@components/errors/ErrorLayout"
import Form from "@components/sign/Form"
import Input from "@components/sign/Input"

import {
    patchPasswordWithPasswordRecoveryToken,
    requestPasswordRecoveryToken,
    resendVerificationEmail,
    signIn,
    signUp,
    verifyEmail,
} from "@api/users.api"

import sleep from "@utils/sleep"

import {
    AtSign,
    HelpCircle,
    Key,
    LogIn,
    Mail,
    RotateCw,
    UserPlus,
} from "feather-icons-react"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export const SignInForm = () => {
    const { t } = useTranslation(null, { keyPrefix: "sign" })

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const email = e.target.email.value
        const password = e.target.password.value

        try {
            await signIn(email, password)
            toast.success(t("sign_in_success"))
            await sleep(1000)

            // TODO: don't navigate; redirect
            navigate("/app/")
        } catch (err) {
            const status = err?.response?.status

            if (status === 400) {
                toast.error(t("sign_in_failed"))
            } else if (status === 403) {
                toast.error(t("email_verify_required"))
            } else if (status === 500) {
                toast.error(t("internal_error"))
            } else {
                toast.error(t("network_error"))
            }

            setIsLoading(false)
        }
    }

    return (
        <>
            <Title>{t("sign_in")}</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    icon={<Mail />}
                    name="email"
                    type="email"
                    placeholder={t("email")}
                    required
                />
                <Input
                    icon={<Key />}
                    name="password"
                    type="password"
                    placeholder={t("password")}
                    required
                />
                <ButtonGroup $justifyContent="right" $margin="1em 0 0 0">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        loading={isLoading}>
                        {isLoading ? t("loading") : t("button_sign_in")}
                    </Button>
                </ButtonGroup>
            </Form>
            <Links>
                <Link to="/sign/up">
                    <LinkText>
                        <UserPlus />
                        {t("button_create_account")}
                    </LinkText>
                </Link>
                <Link to="/sign/request-password-recovery">
                    <LinkText>
                        <HelpCircle />
                        {t("button_forgot_password")}
                    </LinkText>
                </Link>
                <Link to="/sign/verification-resend">
                    <LinkText>
                        <Mail />
                        {t("button_resend_verification")}
                    </LinkText>
                </Link>
            </Links>
        </>
    )
}

export const SignUpForm = () => {
    const { t } = useTranslation(null, { keyPrefix: "sign" })
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const email = e.target.email.value
        const password = e.target.password.value
        const username = e.target.username.value

        try {
            await signUp(email, password, username)
            navigate("/sign/up-complete")
        } catch (err) {
            toast.error(t("sign_up_errors." + err.message))
            setIsLoading(false)
            return
        }
    }

    return (
        <>
            <Title>{t("sign_up")}</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    icon={<Mail />}
                    name="email"
                    type="email"
                    placeholder={t("email")}
                    required
                />
                <Input
                    icon={<Key />}
                    name="password"
                    type="password"
                    placeholder={t("password")}
                    minLength="8"
                    required
                />
                <Input
                    icon={<AtSign />}
                    name="username"
                    type="text"
                    placeholder={t("username")}
                    pattern="^[a-z0-9_]{4,15}$"
                    minLength="4"
                    required
                />
                <TosAgreement>
                    <Trans
                        t={t}
                        i18nKey="tos"
                        components={{ linkToTos: <a href="/tos" /> }}
                    />
                </TosAgreement>
                <ButtonGroup $justifyContent="right" $margin="1em 0">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        loading={isLoading}>
                        {isLoading ? t("loading") : t("button_sign_up")}
                    </Button>
                </ButtonGroup>
            </Form>
            <Links>
                <Link to="/sign/in">
                    <LinkText>
                        <LogIn />
                        {t("button_already_have_account")}
                    </LinkText>
                </Link>
            </Links>
        </>
    )
}

export const SignUpComplete = () => {
    const { t } = useTranslation(null, { keyPrefix: "sign" })

    return (
        <>
            <Title>{t("sign_up_completed")}</Title>
            <Content>
                <Text>{t("check_inbox")}</Text>
            </Content>
            <Links>
                <Link to="/sign/in">
                    <LinkText>
                        <LogIn />
                        {t("link_sign_in")}
                    </LinkText>
                </Link>
                <Link to="/sign/verification-resend">
                    <LinkText>
                        <Mail />
                        {t("button_resend_verification")}
                    </LinkText>
                </Link>
            </Links>
        </>
    )
}

export const EmailVerificationResendForm = () => {
    const { t } = useTranslation(null, { keyPrefix: "email_verification" })

    const mutation = useMutation({
        mutationFn: ({ email }) => resendVerificationEmail(email),
        onSuccess: () => {
            toast.success(t("resend_success"))
        },
        onError: (e) => {
            if (e.response.status === 425) {
                const seconds = e.response.data.seconds
                const minutes = Math.floor(seconds / 60) + 1

                return toast.error(t("resend_error_limit", { minutes }))
            } else if (e.response.status === 400) {
                return toast.error(t("resend_error_bad_request"))
            }

            return toast.error(t("resend_error_any"))
        },
    })

    const onSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        mutation.mutate({ email })
    }

    return (
        <>
            <Title>{t("resend_title")}</Title>
            <Content>
                <form onSubmit={onSubmit}>
                    <Input
                        icon={<Mail />}
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
                            <LogIn />
                            {t("link_sign")}
                        </LinkText>
                    </Link>
                </Links>
            </Content>
        </>
    )
}

export const EmailVerificationForm = () => {
    const { t } = useTranslation(null, { keyPrefix: "email_verification" })

    const [searchParams] = useSearchParams()

    const token = searchParams.get("token")

    const {
        data: email,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["email_verifications", token],
        queryFn: () => verifyEmail(token),
        enabled: !!token,
        refetchOnWindowFocus: false,
        retry: (count, err) => {
            if (err?.response?.status === 400) {
                return false
            }

            return count < 3
        },
    })

    if (isPending) {
        return <FullLoader />
    }

    if (isError) {
        return <Error code="?_?" text={t("invalid_access")} />
    }

    return (
        <>
            <Title>{t("verified_title")}</Title>
            <Content>
                <VerifiedMessage>{t("verified", { email })}</VerifiedMessage>
                <Links>
                    <Link to="/sign/in">
                        <LinkText>
                            <LogIn />
                            {t("link_sign")}
                        </LinkText>
                    </Link>
                </Links>
            </Content>
        </>
    )
}

export const PasswordRecoveryRequestForm = () => {
    const { t } = useTranslation(null, { keyPrefix: "password_recovery" })

    const mutation = useMutation({
        mutationFn: ({ email }) => requestPasswordRecoveryToken(email),
        onSuccess: () => {
            toast.success(t("request_success"))
        },
        onError: (e) => {
            if (e.response.status === 429) {
                return toast.error(t("request_error_limit"))
            } else if (e.response.status === 400) {
                return toast.error(t("request_error_bad_request"))
            }

            return toast.error(t("request_error_any"))
        },
    })

    const onSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        mutation.mutate({ email })
    }

    return (
        <>
            <Title>{t("request_title")}</Title>
            <Content>
                <Text>{t("request_description")}</Text>
                <form onSubmit={onSubmit}>
                    <Input
                        icon={<Mail />}
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
                            <LogIn />
                            {t("link_sign_in")}
                        </LinkText>
                    </Link>
                </Links>
            </Content>
        </>
    )
}

export const PasswordRecoveryForm = () => {
    const { t } = useTranslation(null, { keyPrefix: "password_recovery" })
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const token = searchParams.get("token")

    const mutation = useMutation({
        mutationFn: ({ token, password }) =>
            patchPasswordWithPasswordRecoveryToken(token, password),
        onSuccess: () => {
            toast.success(t("recovery_success"))
            navigate("/sign/in")
        },
        onError: () => {
            return toast.error(t("recovery_error"))
        },
    })

    const onSubmit = (e) => {
        e.preventDefault()
        const password = e.target.password.value
        const passwordAgain = e.target.password_again.value

        if (password.length < 8) {
            return toast.error(t("recovery_error_password_length"))
        }

        if (password != passwordAgain) {
            return toast.error(t("recovery_error_password_unmatch"))
        }

        mutation.mutate({ token, password })
    }

    return (
        <>
            <Title>{t("recovery_title")}</Title>
            <Form onSubmit={onSubmit}>
                <Text>{t("recovery_description")}</Text>
                <Input
                    icon={<Key />}
                    name="password"
                    placeholder={t("placeholder_password")}
                    type="password"
                    minLength="8"
                    required
                    disabled={mutation.isPending}
                />
                <Input
                    icon={<RotateCw />}
                    name="password_again"
                    placeholder={t("placeholder_password_again")}
                    type="password"
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

const Title = styled.h2`
    font-weight: bold;
    font-size: 2rem;
`

const Content = styled.div`
    display: flex;
    flex-direction: column;

    gap: 1rem;
`

const Text = styled.p`
    line-height: 1.3;
    margin-bottom: 1em;
`

const VerifiedMessage = styled.p`
    margin-bottom: 3em;
    font-weight: 500;
`

const Links = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75em;
`

const LinkText = styled.p`
    font-size: 1em;
    font-weight: 500;

    text-align: center;
    line-height: 1.25;
`

const TosAgreement = styled.p`
    text-align: center;
    font-size: 0.75em !important;
    color: ${(p) => p.theme.grey};

    & a {
        display: inline-block;
        text-decoration: underline;
    }
`

const FullLoader = styled(LoaderCircle)`
    width: 3em;
    color: inherit;
    opacity: 0.7;

    border-width: 0.35em;
`
