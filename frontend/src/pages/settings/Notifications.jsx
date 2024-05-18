import Switch from "@components/settings/SettingSwitch"
import Button from "@components/common/Button"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value } from "@components/settings/Section"

import { deleteSubscription, postSubscription } from "@api/notifications.api"
import { useClientSetting } from "@utils/clientSettings"
import { toast } from "react-toastify"

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
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
    const options = {applicationServerKey: publicKey, userVisibleOnly: true}
    const subscription = await registration.pushManager.subscribe(options)
    return postSubscription(subscription)
}

const Notifications = () => {
    const [setting, updateSetting] = useClientSetting()

    const onClick = async () => {
        if (setting.push_notification_subscription) {
            deleteSubscription(setting.push_notification_subscription)
            updateSetting("push_notification_subscription", null)

            toast.info("Disabled push notifications.")
            return
        }

        const permission = await window.Notification.requestPermission()
        if (permission !== "granted") {
            toast.error("You declined notifications.", {toastId: "notification_permission_declined"})
            return
        }

        const webSubscription = await subscribePush()

        updateSetting("push_notification_subscription", webSubscription?.id)
        toast.success("Notification enabled.", {toastId: "notification_enabled"})
    }

    return <>
        <PageTitle>Notifications</PageTitle>
        <Section>
            <Name>Receive push notifications</Name>
            <Description>Get notifications on this device.</Description>
            <Value>
                <Button onClick={onClick}>{setting.push_notification_subscription ? "Disable" : "Enable"}</Button>
            </Value>
        </Section>
        <Section>
            <Name>Play notification sound</Name>
            <Value>
                <Switch name="play_notification_sound" />
            </Value>
        </Section>
    </>
}

export default Notifications