import { useMemo } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"

import Error from "@components/settings/Error"
import Loading from "@components/settings/Loading"
import Section, { Description, Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"
import Switch from "@components/settings/SettingSwitch"

import { getSettings, patchSettings } from "@api/user_setting.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Privacy = () => {
    const {
        data: settings,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: () => getSettings(),
    })

    const { t } = useTranslation("settings", { keyPrefix: "privacy" })

    const mutation = useMutation({
        mutationFn: (data) => {
            return patchSettings(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] })
            toast.success(t("setting_submitted"), {
                toastId: "privacy_setting_submitted",
            })
        },
    })

    const privacyChoices = useMemo(() => makePrivacyChoices(t), [t])

    if (isPending) {
        return <Loading />
    }

    if (isError) {
        return <Error />
    }

    return (
        <>
            <Section>
                <Name>{t("follow_request_approval_manually.name")}</Name>
                <Description>
                    {t("follow_request_approval_manually.description")}
                </Description>
                <Value>
                    <Switch
                        onlineSetting={settings}
                        submit={mutation.mutate}
                        name="follow_request_approval_manually"
                    />
                </Value>
            </Section>

            <Section>
                <Name>{t("follow_request_approval_for_followings.name")}</Name>
                <Description>
                    {t("follow_request_approval_for_followings.description")}
                </Description>
                <Value>
                    <Switch
                        onlineSetting={settings}
                        submit={mutation.mutate}
                        name="follow_request_approval_for_followings"
                    />
                </Value>
            </Section>

            <Section>
                <Name>{t("follow_list_privacy.name")}</Name>
                <Description>
                    {t("follow_list_privacy.description")}
                </Description>
                <Value>
                    <Select
                        onlineSetting={settings}
                        submit={mutation.mutate}
                        name="follow_list_privacy"
                        choices={privacyChoices}
                    />
                </Value>
            </Section>
        </>
    )
}

const makePrivacyChoices = (t) => [
    {
        display: t("follow_list_privacy.values.public"),
        value: "public",
    },
    {
        display: t("follow_list_privacy.values.protected"),
        value: "protected",
    },
    {
        display: t("follow_list_privacy.values.private"),
        value: "private",
    },
]

export default Privacy
