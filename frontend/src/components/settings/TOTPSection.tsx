import { type ChangeEvent, type FormEvent, useState } from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import Confirmation from "@components/common/Confirmation"
import { LoaderCircleBold } from "@components/common/LoaderCircle"
import Section, { Description, Name, Value } from "@components/settings/Section"
import Input from "@components/sign/Input"

import { createTOTP, deleteTOTP, getTOTP, verifyTOTP } from "@api/auth.api"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import QRCode from "qrcode"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface Secret {
    secretCode: string
    imgDataURL: string
}

const TOTPSection = () => {
    const locale = useClientLocale()
    const tz = useClientTimezone()
    const client = useQueryClient()

    const { t } = useTranslation("settings", { keyPrefix: "security.totp" })
    const [inputCode, setInputCode] = useState("")
    const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
        useState(false)

    const queryKey = ["auth", "totp"]
    const enabledQuery = useQuery<{
        enabled: boolean
        created_at: null | string
    }>({
        queryKey,
        queryFn: getTOTP,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const createMut = useMutation<Secret>({
        async mutationFn() {
            const data = await createTOTP()
            return {
                secretCode: data.secret,
                imgDataURL: await QRCode.toDataURL(data.uri),
            }
        },
        onError() {
            toast.error(t("register_error"))
        },
    })

    const verifyMut = useMutation({
        async mutationFn() {
            return verifyTOTP(inputCode)
        },
        onSuccess() {
            createMut.reset()
            setInputCode("")
            client.invalidateQueries({ queryKey })
            return toast.success(t("register_success"))
        },
        onError() {
            toast.error(t("wrong_code"))
            return
        },
    })

    const deleteMut = useMutation({
        mutationFn: deleteTOTP,
        onSuccess() {
            setDeleteConfirmationOpen(false)
            client.invalidateQueries({ queryKey })
            return toast.info(t("delete_success"))
        },
    })

    const openDeleteConfirmation = () => {
        setDeleteConfirmationOpen(true)
    }

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
        setInputCode(value)

        if (value.length >= 6) {
            return verifyMut.mutate()
        }
    }

    const onClickSecretKey = () => {
        if (!createMut.data) {
            return
        }

        navigator.clipboard.writeText(createMut.data.secretCode)
        toast.success(t("copy_success"), { toastId: "totp.copy_success" })
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (inputCode.length !== 6) {
            toast.error(t("enter_6_digit"))
            return
        }

        verifyMut.mutate()
    }

    if (
        enabledQuery.isPending ||
        enabledQuery.isRefetching ||
        enabledQuery.isError
    ) {
        return (
            <Section>
                <Name>{t("name")}</Name>
                <Description>{t("description")}</Description>
                {enabledQuery.isError ? (
                    <Value>error</Value>
                ) : (
                    <Value>
                        <LoaderCircleBold />
                    </Value>
                )}
            </Section>
        )
    }

    return (
        <Section>
            <Name>{t("name")}</Name>
            <Description>{t("description")}</Description>
            <Value>
                {enabledQuery.data.enabled && enabledQuery.data.created_at && (
                    <Text>
                        {t("activated_at", {
                            date: DateTime.fromISO(enabledQuery.data.created_at)
                                .setLocale(locale)
                                .setZone(tz)
                                .toLocaleString(DateTime.DATETIME_FULL),
                        })}
                    </Text>
                )}

                {createMut.data === undefined && (
                    <ButtonGroup $justifyContent="left" $margin="1em 0">
                        <Button
                            onClick={() => createMut.mutate()}
                            disabled={
                                createMut.isPending || deleteMut.isPending
                            }
                            loading={createMut.isPending}>
                            {t(enabledQuery.data.enabled ? "edit" : "enable")}
                        </Button>
                        {enabledQuery.data.enabled && (
                            <Button
                                onClick={openDeleteConfirmation}
                                disabled={deleteMut.isPending}
                                state="danger">
                                {t("delete")}
                            </Button>
                        )}
                    </ButtonGroup>
                )}

                {createMut.data !== undefined && (
                    <form onSubmit={onSubmit}>
                        <Text>{t("qrcode_description")}</Text>
                        <QRCodeImg src={createMut.data.imgDataURL} />
                        <SecretCodeDetails>
                            <summary>{t("cannot_scan")}</summary>
                            <Text>{t("secret_manual")}</Text>
                            <SecretCode onClick={onClickSecretKey}>
                                {createMut.data.secretCode}
                            </SecretCode>
                        </SecretCodeDetails>
                        <Text>{t("enter_code")}</Text>
                        <Input
                            icon={<FeatherIcon icon="hash" />}
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            pattern="^\d{6}$"
                            value={inputCode}
                            onChange={onChangeInput}
                            id="totp"
                            name="totp"
                            autoComplete="one-time-code"
                            placeholder={t("input_placeholder")}
                            disabled={verifyMut.isPending}
                            required
                        />
                        <ButtonGroup $justifyContent="left" $margin="1em 0">
                            <Button
                                state="danger"
                                onClick={() => {
                                    createMut.reset()
                                    setInputCode("")
                                }}
                                disabled={verifyMut.isPending}>
                                {t("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={verifyMut.isPending}
                                loading={verifyMut.isPending}>
                                {t("enter")}
                            </Button>
                        </ButtonGroup>
                    </form>
                )}
            </Value>

            {isDeleteConfirmationOpen && (
                <Confirmation
                    question={t("ask_delete")}
                    buttons={[
                        "close",
                        <Button
                            key="delete"
                            state="danger"
                            onClick={() => deleteMut.mutate()}
                            disabled={deleteMut.isPending}
                            loading={deleteMut.isPending}>
                            {t("delete")}
                        </Button>,
                    ]}
                    onClose={() => setDeleteConfirmationOpen(false)}
                />
            )}
        </Section>
    )
}
const QRCodeImg = styled.img`
    aspect-ratio: 1/1;
    width: 10em;
    height: 10em;
    margin-bottom: 1em;
`

const Text = styled.p`
    line-height: 1.3;
    margin-bottom: 1em;
`

const SecretCodeDetails = styled.details`
    border: 1px solid ${(p) => p.theme.thirdBackgroundColor};
    border-radius: 16px;
    padding: 0.75em;
    margin-bottom: 1em;

    & summary {
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
    }

    &[open] {
        & summary {
            padding-bottom: 1em;
        }
    }
`

const SecretCode = styled.span`
    display: block;

    padding: 1em;
    background-color: ${(p) => p.theme.secondBackgroundColor};

    font-size: 1em;
    font-family: monospace !important;

    box-sizing: border-box;
    width: fit-content;
    word-break: break-all;

    line-height: 1.2;
`

export default TOTPSection
