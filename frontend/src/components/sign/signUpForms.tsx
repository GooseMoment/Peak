import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Button, { ButtonGroup } from "@components/common/Button"
import Input from "@components/common/Input"
import {
    Content,
    Form,
    LinkText,
    Links,
    Text,
    Title,
    TosAgreement,
} from "@components/sign/common"

import { SignUpError, signUp } from "@api/auth.api"

import FeatherIcon from "feather-icons-react"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export function SignUpForm() {
    const { t } = useTranslation("translation", { keyPrefix: "sign" })
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")
        const username = formData.get("username")

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof username !== "string"
        ) {
            toast.error(t("INTERNAL_ERROR"))
            setIsLoading(false)
            return
        }

        try {
            await signUp(email, password, username)
            navigate("/sign/up-complete")
        } catch (err) {
            const error = err as SignUpError
            toast.error(t(error.code))
            setIsLoading(false)
            return
        }
    }

    return (
        <>
            <Title>{t("sign_up")}</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    icon="mail"
                    name="email"
                    type="email"
                    placeholder={t("email")}
                    required
                />
                <Input
                    icon="key"
                    name="password"
                    type="password"
                    placeholder={t("password")}
                    minLength={8}
                    required
                />
                <Input
                    icon="at-sign"
                    name="username"
                    type="text"
                    placeholder={t("username")}
                    pattern="^[a-z0-9_]{4,15}$"
                    minLength={4}
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
                        <FeatherIcon icon="log-in" />
                        {t("button_already_have_account")}
                    </LinkText>
                </Link>
            </Links>
        </>
    )
}

export function SignUpComplete() {
    const { t } = useTranslation("translation", { keyPrefix: "sign" })

    return (
        <>
            <Title>{t("sign_up_completed")}</Title>
            <Content>
                <Text>{t("check_inbox")}</Text>
            </Content>
            <Links>
                <Link to="/sign/in">
                    <LinkText>
                        <FeatherIcon icon="log-in" />
                        {t("link_sign_in")}
                    </LinkText>
                </Link>
                <Link to="/sign/verification-resend">
                    <LinkText>
                        <FeatherIcon icon="mail" />
                        {t("button_resend_verification")}
                    </LinkText>
                </Link>
            </Links>
        </>
    )
}
