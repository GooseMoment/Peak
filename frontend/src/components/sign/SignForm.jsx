import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Form from "@components/sign/Form"
import Input from "@components/sign/Input"
import Button from "@/components/common/Button"

import { signIn, signUp } from "@api/users.api"

import notify from "@utils/notify"
import sleep from "@utils/sleep"

import styled from "styled-components"
import {Mail, AtSign, Key} from "feather-icons-react"
import { Trans, useTranslation } from "react-i18next"


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
                notify.success(t("sign_in_success"))
                await sleep(1000)
                navigate("/app/")
            } else {
                notify.error(t("sign_in_failed"))
                setIsLoading(false)
            }
        } catch (err) {
            notify.error(t("network_error"))
            setIsLoading(false)
            return
        }
    }

    return <Box>
        <Title>{t("sign_in")}</Title>
        <Form onSubmit={onSubmit}>
            <Input icon={<Mail />} name="email" type="email" placeholder="id@example.com" required />
            <Input icon={<Key />} name="password" type="password" placeholder="********" required />
            <Button type="submit" disabled={isLoading}>{isLoading ? t("loading") : t("button_sign_in")}</Button>
        </Form>
        <Links>
            <A href="#">{t("button_forgot_password")}</A>
            <A href="#" onClick={goToSignUp}>{t("button_create_account")}</A>
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
            notify.success(t("sign_up_success"))
            setActive("signIn")
        } catch (err) {
            notify.error(t("sign_up_failed") + err.message)
            setIsLoading(false)
            return
        }
    }

    return <Box>
        <Title>{t("sign_up")}</Title>
        <Form onSubmit={onSubmit}>
            <Input icon={<Mail />} name="email" type="email" placeholder="id@example.com" required />
            <Input icon={<Key />} name="password" type="password" placeholder="********" required />
            <Input icon={<AtSign />} name="username" type="text" 
                placeholder="cool_user_name_0908" pattern="[a-z0-9_-]{4,15}" minlength="4" required />
            <TosAgreement>
                <Trans t={t} i18nKey="tos" components={{linkToTos: <a href="/tos" />}} />
            </TosAgreement>
            <Button type="submit" disabled={isLoading}>{isLoading ? t("loading") : t("button_sign_up")}</Button>
        </Form>
        <Links>
            <A href="#" onClick={goToSignIn}>{t("button_already_have_account")}</A>
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
    text-align: center;
`

const A = styled.div`
    text-decoration: none;
    color: inherit;
    display: block;
    margin-bottom: 0.5em;

    cursor: pointer;
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