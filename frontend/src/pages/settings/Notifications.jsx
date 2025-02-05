import { useMutation } from "@tanstack/react-query"

import Button from "@components/common/Button"
import Section, { Description, Name, Value } from "@components/settings/Section"
import Switch from "@components/settings/SettingSwitch"

import { deleteSubscription, postSubscription } from "@api/notifications.api"

import { useClientSetting } from "@utils/clientSettings"

import { states } from "@assets/themes"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

const urlB64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const subscribePush = async () => {
    const registration = await navigator.serviceWorker.ready
    const publicKey = urlB64ToUint8Array(VAPID_PUBLIC_KEY)
    const options = { applicationServerKey: publicKey, userVisibleOnly: true }
    const subscription = await registration.pushManager.subscribe(options)
    return postSubscription(subscription)
}

const Notifications = () => {
    const [setting, updateSetting] = useClientSetting()
    const { t } = useTranslation("settings", { keyPrefix: "notifications" })

    const enableMutation = useMutation({
        mutationFn: () => subscribePush(),
        onSuccess: (webSubscription) => {
            updateSetting("push_notification_subscription", webSubscription?.id)
            toast.success(
                t("push_notification_subscription.enabled_push_notification"),
                { toastId: "notification_enabled" },
            )
        },
        onError: () => {
            toast.error(
                t(
                    "push_notification_subscription.enabled_push_notification_error",
                ),
                { toastId: "notification_enabled_error" },
            )
        },
    })

    const disableMutation = useMutation({
        mutationFn: () =>
            deleteSubscription(setting.push_notification_subscription),
        onSuccess: () => {
            toast.info(
                t("push_notification_subscription.disabled_push_notification"),
            )
        },
        onError: () => {
            toast.warning(
                t(
                    "push_notification_subscription.disabled_push_notification_error",
                ),
            )
        },
        onSettled: async () => {
            updateSetting("push_notification_subscription", null)
        },
    })

    const isPending = enableMutation.isPending || disableMutation.isPending

    const toggleWebPush = async () => {
        if (setting.push_notification_subscription) {
            disableMutation.mutate()
            return
        }

        const permission = await window.Notification.requestPermission()
        if (permission !== "granted") {
            toast.error(
                t("push_notification_subscription.declined_push_notification"),
                { toastId: "notification_permission_declined" },
            )
            return
        }

        enableMutation.mutate()
    }

    return (
        <>
            <Section>
                <Name>{t("push_notification_subscription.name")}</Name>
                <Description>
                    {t("push_notification_subscription.description")}
                </Description>
                <Value>
                    <Button
                        onClick={toggleWebPush}
                        loading={isPending}
                        disabled={isPending}
                        state={
                            setting.push_notification_subscription
                                ? states.danger
                                : states.text
                        }>
                        {setting.push_notification_subscription
                            ? t(
                                  "push_notification_subscription.values.button_disable",
                              )
                            : t(
                                  "push_notification_subscription.values.button_enable",
                              )}
                    </Button>
                </Value>
            </Section>
            <Section>
                <Name>{t("play_notification_sound.name")}</Name>
                <Value>
                    <Switch name="play_notification_sound" />
                </Value>
            </Section>
        </>
    )
}

export default Notifications
