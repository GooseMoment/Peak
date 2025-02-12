import { startTransition, useMemo, useState } from "react"

import styled from "styled-components"

import Button from "@components/common/Button"
import ConfirmationSignOut from "@components/settings/ConfirmationSignOut"
import Section, { Description, Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"
import SettingSwitch from "@components/settings/SettingSwitch"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const General = () => {
    const { t } = useTranslation("settings", { keyPrefix: "general" })

    const startpageChoices = useMemo(() => makeStartpageChoices(t), [t])

    const [isSignOutConfirmationOpen, setSignOutConfirmationOpen] =
        useState(false)

    const openSignOutConfirmation = () => {
        startTransition(() => {
            setSignOutConfirmationOpen(true)
        })
    }

    return (
        <>
            <Section>
                <Name>{t("startpage.name")}</Name>
                <Description>{t("startpage.description")}</Description>
                <Value>
                    <Select choices={startpageChoices} name="startpage" />
                </Value>
            </Section>

            <Section>
                <Name>{t("delete_task_after_alert.name")}</Name>
                <Description>
                    {t("delete_task_after_alert.description")}
                </Description>
                <Value>
                    <SettingSwitch name="delete_task_after_alert" />
                </Value>
            </Section>

            <Section>
                <Name>{t("sign_out.name")}</Name>
                <Value>
                    <Button onClick={openSignOutConfirmation}>
                        <SignOutIcon icon="log-out" />
                        {t("sign_out.values.button_sign_out")}
                    </Button>
                </Value>
                {isSignOutConfirmationOpen && (
                    <ConfirmationSignOut
                        onClose={() => setSignOutConfirmationOpen(false)}
                    />
                )}
            </Section>
        </>
    )
}

const makeStartpageChoices = (t) => [
    {
        display: t("startpage.values.home"),
        value: "home",
    },
    {
        display: t("startpage.values.today"),
        value: "today",
    },
]

const SignOutIcon = styled(FeatherIcon)`
    stroke-width: 3px;
    top: 0;
`

export default General
