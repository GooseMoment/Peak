import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import Input from "@components/common/Input"
import { Form, LinkText, Links, Text, Title } from "@components/sign/common"

import { TOTPAuthError, authTOTP } from "@api/auth.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export default function TOTPAuthForm() {
    const { t } = useTranslation("translation", { keyPrefix: "sign" })
    const navigate = useNavigate()
    const [totpCode, setTOTPCode] = useState("")

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value.replace(/\D/g, "").slice(0, 6)
        setTOTPCode(value)

        if (value.length >= 6 && !mut.isPending) {
            return mut.mutate()
        }
    }

    const mut = useMutation<boolean, TOTPAuthError>({
        mutationFn: () => {
            if (totpCode.length < 6) {
                return Promise.reject(new Error("ENTER_6_DIGIT"))
            }

            return authTOTP(totpCode)
        },
        onSuccess: () => {
            toast.success(t("sign_in_success"))
            return navigate("/app/")
        },
        onError: (err) => {
            toast.error(t(err.code))

            if (
                err.code === "TOKEN_REQUIRED" ||
                err.code === "TOKEN_INVALID" ||
                err.code === "TOKEN_OUT_OF_COUNTS"
            ) {
                return navigate("/sign/in")
            }
        },
    })

    return (
        <>
            <div>
                <Title>{t("two_factor_authentication")}</Title>
                <Text>{t("two_factor_authentication_description")}</Text>
            </div>
            <Form
                onSubmit={(e) => {
                    e.preventDefault()
                    mut.mutate()
                }}>
                <Input
                    icon="hash"
                    value={totpCode}
                    onChange={onChange}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    pattern="^\d{6}$"
                    id="totp"
                    name="totp"
                    autoComplete="one-time-code"
                    placeholder={t("6-digit_code")}
                    required
                />
                <ButtonGroup $justifyContent="right" $margin="1em 0 0 0">
                    <Button
                        type="submit"
                        disabled={mut.isPending}
                        loading={mut.isPending}>
                        {mut.isPending ? t("loading") : t("button_sign_in")}
                    </Button>
                </ButtonGroup>
            </Form>
            <Links>
                <Link to="/sign/in">
                    <LinkText>
                        <FeatherIcon icon="x-circle" />
                        {t("button_cancel")}
                    </LinkText>
                </Link>
                <Link to="/sign/two_factor/email">
                    <LinkText>
                        <FeatherIcon icon="mail" />
                        {t("button_email_authentication")}
                    </LinkText>
                </Link>
            </Links>
        </>
    )
}
