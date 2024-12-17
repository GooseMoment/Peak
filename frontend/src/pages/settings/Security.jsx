import { useState } from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import styled from "styled-components"

import Error from "@components/settings/Error"
import Section, { Description, Name, Value } from "@components/settings/Section"

import {
    confirmRegistrationTOTP,
    deleteRegistrationTOTP,
    getTOTPRegistered,
    registerTOTP,
} from "@api/auth.api"

import Button, { ButtonGroup } from "@/components/common/Button"
import Input from "@/components/sign/Input"
import { useClientLocale, useClientTimezone } from "@/utils/clientSettings"
import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import QRCode from "qrcode"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Security = () => {
    const locale = useClientLocale()
    const tz = useClientTimezone()
    const client = useQueryClient()

    const { t } = useTranslation("settings", { keyPrefix: "security" })
    const [totpQRData, setTOTPQRData] = useState(null)
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
                return
            }

            if (method === "patch") {
                setTOTPQRData(null)
                client.invalidateQueries(["auth", "totp"])
                return toast.success(
                    "Two-factor authentication is now enabled.",
                )
            }

            if (method === "delete") {
                client.invalidateQueries(["auth", "totp"])
                return toast.info("Two-factor authentication is now disabled.")
            }
        },
        onError: async (err, { method }) => {
            if (method === "patch") {
                toast.error("The code you entered is wrong.")
                return
            }
        },
    })

    const onChangeTOTPInput = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
        setTOTPCode(value)

        if (value.length >= 6) {
            return totpMut.mutate({ method: "patch" })
        }
    }

    if (totpQuery.isError) {
        return <Error />
    }

    return (
        <>
            <Section>
                <Name>{t("totp.name")}</Name>
                <Description>{t("totp.description")}</Description>
                <Value>
                    {!totpQuery.isLoading && totpQuery.data.enabled && (
                        <p>
                            {t("totp.activated_at", {
                                date: DateTime.fromISO(
                                    totpQuery.data.created_at,
                                )
                                    .setLocale(locale)
                                    .setZone(tz)
                                    .toLocaleString(DateTime.DATETIME_FULL),
                            })}
                        </p>
                    )}
                    {!totpQuery.isLoading && !totpQRData && (
                        <ButtonGroup $justifyContent="left" $margin="1em 0">
                            <Button
                                onClick={() =>
                                    totpMut.mutate({ method: "post" })
                                }
                                disabled={totpMut.isPending}
                                loading={totpMut.isLoading}>
                                {t(
                                    totpQuery.data.enabled
                                        ? "totp.edit"
                                        : "totp.enable",
                                )}
                            </Button>
                            {totpQuery.data.enabled && (
                                <Button
                                    onClick={() =>
                                        totpMut.mutate({ method: "delete" })
                                    }
                                    disabled={totpMut.isPending}
                                    loading={totpMut.isLoading}>
                                    {t("totp.delete")}
                                </Button>
                            )}
                        </ButtonGroup>
                    )}

                    {totpQRData && (
                        <>
                            <img src={totpQRData} />
                            <p>
                                Scan this QR code with your preferred
                                authentication app. Enter the code below to
                                complete TOTP registration.
                            </p>
                            <Input
                                icon={<FeatherIcon icon="hash" />}
                                name="totp_code"
                                type="text"
                                maxLength="6"
                                pattern="^\d{6}$"
                                value={totpCode}
                                onChange={onChangeTOTPInput}
                                autoComplete="one-time-code"
                                placeholder={"6-digit code"}
                                required
                            />
                            <Button
                                onClick={() =>
                                    totpMut.mutate({ method: "patch" })
                                }>
                                Enter
                            </Button>
                        </>
                    )}
                </Value>
            </Section>
        </>
    )
}

const TOTPBox = styled.div`
    display: flex;
    justify-content: space-between;
`

export default Security
