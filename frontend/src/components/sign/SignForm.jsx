import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Form from "@components/sign/Form"
import Input from "@components/sign/Input"
import Button, { ButtonGroup } from "@components/common/Button"

import { signIn, signUp } from "@api/users.api"

import sleep from "@utils/sleep"
import { useClientLocale } from "@utils/clientSettings"

import styled from "styled-components"
import { Mail, AtSign, Key, HelpCircle, UserPlus, LogIn } from "feather-icons-react"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const SignForm = () => {
    const [active, setActive] = useState("signIn")

    if (active === "signIn") {
        return <SignInForm setActive={setActive} />
    } else if (active === "signUp") {
        return <SignUpForm setActive={setActive} />
    }
}

const SignInForm = ({setActive}) => {
    const { t } = useTranslation(null, {keyPrefix: "sign"})
    
    const goToSignUp = e => {
        e.preventDefault()
        setActive("signUp")
    }
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async e => {
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

    return <Box>
        <Title>{t("sign_in")}</Title>
        <Form onSubmit={onSubmit}>
            <Input icon={<Mail />} name="email" type="email" placeholder={t("email")} required />
            <Input icon={<Key />} name="password" type="password" placeholder={t("password")} required />
            <ButtonGroup $justifyContent="right" $margin="1em 0 0 0">
                <Button type="submit" disabled={isLoading} $loading={isLoading}>
                    {isLoading ? t("loading") : t("button_sign_in")}
                </Button>
            </ButtonGroup>
        </Form>
        <Links>
            <Link onClick={goToSignUp}>
                <LinkText><UserPlus />{t("button_create_account")}</LinkText>
            </Link>
            <Link to="/password-recovery">
                <LinkText><HelpCircle />{t("button_forgot_password")}</LinkText>
            </Link>
            <Link to="/verification">
                <LinkText><Mail />{t("button_resend_verification")}</LinkText>
            </Link>
        </Links>
    </Box>
}

const SignUpForm = ({setActive}) => {
    const { t } = useTranslation(null, {keyPrefix: "sign"})
    const locale = useClientLocale()

    const goToSignIn = e => {
        e.preventDefault()
        setActive("signIn")
    }
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        const email = e.target.email.value
        const password = e.target.password.value
        const username = e.target.username.value

        try {
            await signUp(email, password, username, locale)
            toast.success(t("sign_up_success"))
            setActive("signIn")
        } catch (err) {
            toast.error(t("sign_up_errors." + err.message))
            setIsLoading(false)
            return
        }
    }

    return <Box>
        <Title>{t("sign_up")}</Title>
        <Form onSubmit={onSubmit}>
            <Input icon={<Mail />} name="email" type="email" placeholder={t("email")} required />
            <Input icon={<Key />} name="password" type="password" placeholder={t("password")} minLength="8" required />
            <Input icon={<AtSign />} name="username" type="text" 
                placeholder={t("username")} pattern="^[a-z0-9_]{4,15}$" minLength="4" required />
            <TosAgreement>
                <Trans t={t} i18nKey="tos" components={{linkToTos: <a href="/tos" />}} />
            </TosAgreement>
            <ButtonGroup $justifyContent="right" $margin="1em 0">
                <Button type="submit" disabled={isLoading} $loading={isLoading}>
                    {isLoading ? t("loading") : t("button_sign_up")}
                </Button>
            </ButtonGroup>
        </Form>
        <Links>
            <Link onClick={goToSignIn}>
                <LinkText><LogIn />{t("button_already_have_account")}</LinkText>
            </Link>
        </Links>
    </Box>
}

const Box = styled.section`
    display: flex;
    overflow-y: scroll;
    justify-content: center;
    flex-direction: column;
    gap: 5rem;

    padding: 2.25rem;
    color: ${p => p.theme.textColor};
    background-color: ${p => p.theme.backgroundColor};

    grid-area: 1 / 2 / 2 / 3;

    font-size: 1rem;

    @media screen and (max-width: 800px) {
        & {
            width: 100%;
        }
    }
`

const Title = styled.h2`
    font-weight: bold;
    font-size: 2rem;
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
    color: ${p => p.theme.grey};

    & a {
        display: inline-block;
        text-decoration: underline;
    }
`

export default SignForm