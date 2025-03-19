import { useEffect, useMemo, useState } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import CheckboxGroup, {
    ICheckboxItem,
} from "@components/settings/CheckboxGroup"
import Section, { Description, Name, Value } from "@components/settings/Section"

import {
    NotificationType,
    WebPushSubscription,
    deleteSubscription,
    getSubscription,
    patchSubscription,
    postSubscription,
} from "@api/notifications.api"

import { useClientSetting } from "@utils/clientSettings"

import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

const urlB64ToUint8Array = (base64String: string) => {
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

const SectionNotification = () => {
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

    const disableMutation = useMutation<void, Error, string>({
        mutationFn: (subscriptionID) => deleteSubscription(subscriptionID),
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
            updateSetting("push_notification_subscription", undefined)
        },
    })

    const toggleWebPush = async () => {
        if (setting.push_notification_subscription) {
            disableMutation.mutate(setting.push_notification_subscription)
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

    const isPending = enableMutation.isPending || disableMutation.isPending

    return (
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
                            ? "danger"
                            : "text"
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
    )
}

const SectionAllowList = () => {
    const [setting, updateSetting] = useClientSetting()
    const { t } = useTranslation("settings", {
        keyPrefix: "notifications.allowed_types",
    })

    const [selectedItems, setSelectedItems] = useState<ICheckboxItem[]>([])
    const items = useMemo(() => makeAllowlistItems(t), [t])

    const query = useQuery<
        WebPushSubscription,
        Error,
        WebPushSubscription["excluded_types"]
    >({
        placeholderData: {
            excluded_types: setting.push_notification_excluded_types || [],
        } as WebPushSubscription,
        queryKey: [
            "subscriptions",
            setting.push_notification_subscription,
            "excluded_types",
        ],
        // This component is loaded if setting.push_notification_subscription is present
        queryFn: () => getSubscription(setting.push_notification_subscription!),
        select: (data) => data.excluded_types,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (!query.data) {
            return
        }

        setSelectedItems(
            items.filter((item) => !query.data.includes(item.name)),
        )
    }, [query.data])

    const mut = useMutation({
        mutationFn: () => {
            const data = items
                .filter(
                    (item) =>
                        !selectedItems.some(
                            (selectedItem) => selectedItem.name === item.name,
                        ),
                )
                .map((item) => item.name)
            // This component is rendered if push_notification_subscription is present
            return patchSubscription(setting.push_notification_subscription!, {
                excluded_types: data,
            })
        },
        onSuccess: (data) => {
            updateSetting(
                "push_notification_excluded_types",
                data.excluded_types,
            )
            toast.success(t("success"))
        },
        onError: () => {
            toast.error(t("failed"))
        },
    })

    return (
        <Section>
            <Name>{t("name")}</Name>
            <Description>{t("description")}</Description>
            <Value>
                <CheckboxGroup
                    items={items}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                />
                <ButtonGroup $justifyContent="right" $margin="1em 0">
                    <Button
                        onClick={() => mut.mutate()}
                        disabled={mut.isPending}
                        loading={mut.isPending}>
                        {t("values.button_save")}
                    </Button>
                </ButtonGroup>
            </Value>
        </Section>
    )
}

const Notifications = () => {
    const [setting] = useClientSetting()

    return (
        <>
            <SectionNotification />
            {setting.push_notification_subscription && <SectionAllowList />}
        </>
    )
}

const makeAllowlistItems = (
    t: TFunction<"settings", "notifications.allowed_types">,
) =>
    [
        { name: "comment", display: t("values.comment") },
        { name: "follow", display: t("values.follow") },
        { name: "follow_request", display: t("values.follow_request") },
        {
            name: "follow_request_accepted",
            display: t("values.follow_request_accepted"),
        },
        { name: "peck", display: t("values.peck") },
        { name: "reaction", display: t("values.reaction") },
        { name: "task_reminder", display: t("values.task_reminder") },
    ] as { name: NotificationType; display: string }[]

export default Notifications
