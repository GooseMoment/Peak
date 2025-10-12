import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Button, { ButtonGroup } from "@components/common/Button"
import Input from "@components/common/Input"
import { Form, LinkText, Links, Title } from "@components/sign/common"

import { SignInError, signIn } from "@api/auth.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export default function SignInForm() {
    const { t } = useTranslation("translation", { keyPrefix: "sign" })

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        if (typeof email !== "string" || typeof password !== "string") {
            toast.error(t("INTERNAL_ERROR"))
            setIsLoading(false)
            return
        }

        try {
            const twoFactorAuthEnabled = await signIn(email, password)

            if (twoFactorAuthEnabled) {
                return navigate("/sign/two_factor/totp")
            }

            toast.success(t("sign_in_success"))
            await new Promise((r) => setTimeout(r, 1000))
            navigate("/app/")
        } catch (err) {
            const error = err as SignInError
            toast.error(t(error.code))
            setIsLoading(false)
        }
    }

    return (
        <>
            <Title>{t("sign_in")}</Title>
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
                        <FeatherIcon icon="user-plus" />
                        {t("button_create_account")}
                    </LinkText>
                </Link>
                <Link to="/sign/request-password-recovery">
                    <LinkText>
                        <FeatherIcon icon="help-circle" />
                        {t("button_forgot_password")}
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
