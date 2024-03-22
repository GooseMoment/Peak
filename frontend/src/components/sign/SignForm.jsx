import { useState } from "react"

import Form from "@components/sign/Form"
import Input from "@components/sign/Input"
import Button from "@components/sign/Button"

import styled from "styled-components"
import {Mail, AtSign, Key} from "feather-icons-react"

const SignForm = () => {
    const [active, setActive] = useState("signIn")

    if (active === "signIn") {
        return <SignInForm setActive={setActive} />
    } else if (active === "signUp") {
        return <SignUpForm setActive={setActive} />
    }
}

const SignInForm = ({setActive}) => {
    const goToSignUp = e => {
        e.preventDefault()
        setActive("signUp")
    }

    return <Box>
        <Title>Sign in</Title>
        <Form>
            <Input icon={<Mail />} name="email" type="email" placeholder="id@example.com" required />
            <Input icon={<Key />} name="password" type="password" placeholder="********" required />
            <Button type="submit">Go!</Button>
        </Form>
        <Links>
            <A href="#">Forgot password?</A>
            <A href="#" onClick={goToSignUp}>Create an account</A>
        </Links>
    </Box>
}

const SignUpForm = ({setActive}) => {
    const goToSignIn = e => {
        e.preventDefault()
        setActive("signIn")
    }

    return <Box>
        <Title>Sign in</Title>
        <Form>
            <Input icon={<Mail />} name="email" type="email" placeholder="id@example.com" required />
            <Input icon={<Key />} name="password" type="password" placeholder="********" required />
            <Input icon={<AtSign />} name="username" type="text" 
                placeholder="cool_user_name_0908" pattern="[a-z0-9_-]{4,15}" minlength="4" required />
            <TosAgreement>
                By creating an account, you agree to our <a href="/tos">Terms of Service</a>.
            </TosAgreement>
            <Button type="submit">Let's start!</Button>
        </Form>
        <Links>
            <A href="#" onClick={goToSignIn}>Already have an account</A>
        </Links>
    </Box>
}

const Box = styled.section`
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 5rem;

    padding: 2.25rem;
    background-color: white;

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
    color: grey;

    & a {
        display: inline-block;
        text-decoration: underline;
    }
`

export default SignForm