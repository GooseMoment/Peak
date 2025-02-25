import { useState } from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import Confirmation from "@components/common/Confirmation"
import Input from "@components/common/Input"
import Error from "@components/settings/Error"
import PasswordSection from "@components/settings/PasswordSection"
import Section, { Description, Name, Value } from "@components/settings/Section"

import {
    confirmRegistrationTOTP,
    deleteRegistrationTOTP,
    getTOTPRegistered,
    registerTOTP,
} from "@api/auth.api"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"
import QRCode from "qrcode"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Security = () => {
    const locale = useClientLocale()
    const tz = useClientTimezone()
    const client = useQueryClient()

    const { t } = useTranslation("settings", { keyPrefix: "security" })
    const [isTOTPConfirmationOpen, setTOTPConfirmationOpen] = useState(false)
    const [totpQRData, setTOTPQRData] = useState(null)
    const [totpSecret, setTOTPSecret] = useState(null)
    const [totpCode, setTOTPCode] = useState("")

    const totpQuery = useQuery({
        queryKey: ["auth", "totp"],
        queryFn: () => getTOTPRegistered(),
    })

    const totpMut = useMutation({
        mutationFn: ({ method }) => {
            if (method === "post") {
                return registerTOTP()
            }

            if (method === "patch") {
                return confirmRegistrationTOTP(totpCode)
            }

            if (method === "delete") {
                return deleteRegistrationTOTP()
            }
        },
        onSuccess: async (data, { method }) => {
            if (method === "post") {
                const dataURL = await QRCode.toDataURL(data.uri)
                setTOTPQRData(dataURL)
                setTOTPSecret(data.secret)
                return
            }

            if (method === "patch") {
                setTOTPQRData(null)
                client.invalidateQueries(["auth", "totp"])
                return toast.success(t("totp.register_success"))
            }

            if (method === "delete") {
                setTOTPConfirmationOpen(false)
                client.invalidateQueries(["auth", "totp"])
                return toast.info(t("totp.delete_success"))
            }
        },
        onError: async (err, { method }) => {
            if (method === "patch") {
                toast.error(t("totp.wrong_code"))
                return
            }
        },
    })

    const deleteTOTP = () => {
        setTOTPConfirmationOpen(true)
    }

    const onChangeTOTPInput = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
        setTOTPCode(value)

        if (value.length >= 6) {
            return totpMut.mutate({ method: "patch" })
        }
    }

    const onClickSecret = () => {
        navigator.clipboard.writeText(totpSecret)
        toast.success(t("totp.copy_success"), { toastId: "totp.copy_success" })
    }

    if (totpQuery.isError) {
        return <Error />
    }

    return (
        <>
            <Section>
                <PasswordSection />

                <Name>{t("totp.name")}</Name>
                <Description>{t("totp.description")}</Description>
                <Value>
                    {!totpQuery.isLoading && totpQuery.data.enabled && (
                        <Text>
                            {t("totp.activated_at", {
                                date: DateTime.fromISO(
                                    totpQuery.data.created_at,
                                )
                                    .setLocale(locale)
                                    .setZone(tz)
                                    .toLocaleString(DateTime.DATETIME_FULL),
                            })}
                        </Text>
                    )}
                    {!totpQuery.isLoading && !totpQRData && (
                        <ButtonGroup $justifyContent="left" $margin="1em 0">
                            <Button
                                onClick={() =>
                                    totpMut.mutate({ method: "post" })
                                }
                                disabled={totpMut.isPending}
                                loading={totpMut.isPending}>
                                {t(
                                    totpQuery.data.enabled
                                        ? "totp.edit"
                                        : "totp.enable",
                                )}
                            </Button>
                            {totpQuery.data.enabled && (
                                <Button onClick={deleteTOTP} state="danger">
                                    {t("totp.delete")}
                                </Button>
                            )}
                        </ButtonGroup>
                    )}

                    {totpQRData && (
                        <>
                            <QRCodeImg src={totpQRData} />
                            <Text>{t("totp.qrcode_description")}</Text>
                            <Text>{t("totp.secret_manual")}</Text>
                            <Secret onClick={onClickSecret}>
                                {totpSecret}
                            </Secret>
                            <Input
                                icon="hash"
                                name="totp_code"
                                type="text"
                                maxLength="6"
                                pattern="^\d{6}$"
                                value={totpCode}
                                onChange={onChangeTOTPInput}
                                autoComplete="one-time-code"
                                placeholder={t("totp.input_placeholder")}
                                required
                            />
                            <ButtonGroup $justifyContent="left" $margin="1em 0">
                                <Button
                                    disabled={totpMut.isPending}
                                    loading={totpMut.isPending}
                                    onClick={() =>
                                        totpMut.mutate({ method: "patch" })
                                    }>
                                    {t("totp.enter")}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setTOTPQRData(null)
                                        setTOTPSecret(null)
                                        setTOTPCode("")
                                    }}>
                                    {t("totp.cancel")}
                                </Button>
                            </ButtonGroup>
                        </>
                    )}
                </Value>
            </Section>
            {isTOTPConfirmationOpen && (
                <Confirmation
                    question={t("totp.ask_delete")}
                    buttons={[
                        <Button
                            key="delete"
                            state="danger"
                            onClick={() => totpMut.mutate({ method: "delete" })}
                            disabled={totpMut.isPending}
                            loading={totpMut.isPending}>
                            {t("totp.delete")}
                        </Button>,
                        "close",
                    ]}
                    onClose={() => setTOTPConfirmationOpen(false)}
                />
            )}
        </>
    )
}

const QRCodeImg = styled.img`
    aspect-ratio: 1/1;
    width: 10em;
    height: 10em;
`

const Text = styled.p`
    line-height: 1.3;
    margin-bottom: 1em;
`

const Secret = styled.span`
    display: block;

    padding: 1em;
    background-color: ${(p) => p.theme.secondBackgroundColor};

    font-size: 1em;
    font-family: monospace !important;

    box-sizing: border-box;
    width: fit-content;
    word-break: break-all;

    line-height: 1.2;

    margin-bottom: 1em;
`

export default Security
