import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Form from "@components/sign/Form"
import Input from "@components/sign/Input"
import Button, { ButtonGroup } from "@components/common/Button"

import { signIn, signUp } from "@api/users.api"

import sleep from "@utils/sleep"
import { cubicBeizer } from "@assets/keyframes"

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
            const res = await signIn(email, password)
            if (res) {
                toast.success(t("sign_in_success"))
                await sleep(1000)
                navigate("/app/")
            } else {
                toast.error(t("sign_in_failed"))
                setIsLoading(false)
            }
        } catch (err) {
            toast.error(t("network_error"))
            setIsLoading(false)
            return
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
            <Link to="/reset-password">
                <LinkBox>
                    <HelpCircle />
                    <LinkText>{t("button_forgot_password")}</LinkText>
                </LinkBox>
            </Link>
            <Link onClick={goToSignUp}>
                <LinkBox>
                    <UserPlus />
                    <LinkText>{t("button_create_account")}</LinkText>
                </LinkBox>
            </Link>
        </Links>
    </Box>
}

const SignUpForm = ({setActive}) => {
    const { t } = useTranslation(null, {keyPrefix: "sign"})

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
            await signUp(email, password, username)
            toast.success(t("sign_up_success"))
            setActive("signIn")
        } catch (err) {
            toast.error(t("sign_up_failed") + err.message)
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
                placeholder={t("username")} pattern="[a-z0-9_-]{4,15}" minLength="4" required />
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
                <LinkBox>
                    <LogIn />
                    <LinkText>{t("button_already_have_account")}</LinkText>
                </LinkBox>
            </Link>
        </Links>
    </Box>
}

const Box = styled.section`
    display: flex;
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
    justify-content: center;
    gap: 2em;
`

const LinkBox = styled.div`
    border: 2px solid ${p => p.theme.grey};
    border-radius: 10px;

    color: ${p => p.theme.grey};

    box-sizing: border-box;
    height: 6em;
    width: 5.5em;
    padding: 0.75em;
    padding-bottom: 0.5em;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    svg {
        font-size: 2em;
        top: unset;
        margin-right: unset;
    }

    transition: border-color 0.5s ${cubicBeizer}, color 0.5s ${cubicBeizer};

    &:hover {
        border-color: ${p => p.theme.textColor};
        color: ${p => p.theme.textColor};
    }
`

const LinkText = styled.p`
    font-size: 0.75em;
    font-weight: bold;

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