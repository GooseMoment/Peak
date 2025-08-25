import { useMemo } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import Section, {
    Description,
    Name,
    Value,
    ValueError,
} from "@components/settings/Section"
import { UserSettingSelect } from "@components/settings/Select"
import { UserSettingSwitch } from "@components/settings/SettingSwitch"

import {
    type UserSetting,
    getSettings,
    patchSettings,
} from "@api/user_setting.api"

import queryClient from "@queries/queryClient"

import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Privacy = () => {
    const {
        data: settings,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: () => getSettings(),
    })

    const { t } = useTranslation("settings", { keyPrefix: "privacy" })

    const mutation = useMutation({
        mutationFn: (data: Partial<UserSetting>) => {
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
        return <LoaderCircleFull />
    }

    if (isError) {
        return (
            <Section>
                <ValueError onClickRetry={refetch} />
            </Section>
        )
    }

    return (
        <>
            <Section>
                <Name>{t("follow_request_approval_manually.name")}</Name>
                <Description>
                    {t("follow_request_approval_manually.description")}
                </Description>
                <Value>
                    <UserSettingSwitch
                        userSetting={settings}
                        submit={mutation.mutate}
                        name="follow_request_approval_manually"
                    />
                </Value>
            </Section>

            {settings.follow_request_approval_manually && (
                <Section>
                    <Name>
                        {t("follow_request_approval_for_followings.name")}
                    </Name>
                    <Description>
                        {t(
                            "follow_request_approval_for_followings.description",
                        )}
                    </Description>
                    <Value>
                        <UserSettingSwitch
                            userSetting={settings}
                            submit={mutation.mutate}
                            name="follow_request_approval_for_followings"
                        />
                    </Value>
                </Section>
            )}

            <Section>
                <Name>{t("follow_list_privacy.name")}</Name>
                <Description>
                    {t("follow_list_privacy.description")}
                </Description>
                <Value>
                    <UserSettingSelect
                        userSetting={settings}
                        submit={mutation.mutate}
                        name="follow_list_privacy"
                        choices={privacyChoices}
                    />
                </Value>
            </Section>
        </>
    )
}

const makePrivacyChoices = (t: TFunction<"settings", "privacy">) => [
    {
        display: t("follow_list_privacy.values.public"),
        value: "public" as const,
    },
    {
        display: t("follow_list_privacy.values.protected"),
        value: "protected" as const,
    },
    {
        display: t("follow_list_privacy.values.private"),
        value: "private" as const,
    },
]

export default Privacy
