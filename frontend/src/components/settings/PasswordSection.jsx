import { useState } from "react"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup, buttonForms } from "@components/common/Button"
import Section, { Name, Value } from "@components/settings/Section"
import Input from "@components/sign/Input"

import { patchPassword } from "@api/users.api"

import { states } from "@assets/themes"

import { Key, RotateCw } from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const PasswordSection = () => {
    const { t } = useTranslation("settings", { keyPrefix: "account" })

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordAgain, setNewPasswordAgain] = useState("")

    const mutation = useMutation({
        mutationFn: () => {
            return patchPassword(currentPassword, newPassword)
        },
        onSuccess: () => {
            toast.success(t("password_change_success"))

            setCurrentPassword("")
            setNewPassword("")
            setNewPasswordAgain("")
        },
        onError: (e) => {
            if (
                e.response?.data?.code ===
                "PATCHPASSWORD_WRONG_CURRENT_PASSWORD"
            ) {
                toast.error(t("password_wrong"))
                return
            }
            toast.error(t("password_change_error"))
        },
    })

    const changePassword = async (e) => {
        e.preventDefault()

        if (newPassword.length < 8) {
            toast.error(t("password_too_short"))
            return
        }

        if (currentPassword === newPassword) {
            toast.error(t("password_is_same"))
            return
        }

        if (newPassword !== newPasswordAgain) {
            toast.error(t("password_not_match"))
            return
        }

        mutation.mutate()
    }

    return (
        <Section>
            <Name>{t("change_password")}</Name>
            <Value>
                <PasswordChangeForm onSubmit={changePassword}>
                    <Input
                        icon={<Key />}
                        name="password"
                        type="password"
                        placeholder={t("current_password")}
                        autoComplete="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                        icon={<Key />}
                        name="new_password"
                        type="password"
                        placeholder={t("new_password")}
                        autoComplete="new-password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                        icon={<RotateCw />}
                        name="new_password_again"
                        type="password"
                        autoComplete="new-password"
                        placeholder={t("new_password_again")}
                        required
                        value={newPasswordAgain}
                        onChange={(e) => setNewPasswordAgain(e.target.value)}
                    />
                    <div>
                        <ButtonGroup $justifyContent="right" $margin="0em 0em 2em 0em">
                            <Button
                                disabled={mutation.isPending}
                                loading={mutation.isPending}
                                form={buttonForms.filled}
                                state={states.danger}
                                type="submit">
                                {t("button_change")}
                            </Button>
                        </ButtonGroup>
                    </div>
                </PasswordChangeForm>
            </Value>
        </Section>
    )
}

const PasswordChangeForm = styled.form`
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
`

export default PasswordSection
