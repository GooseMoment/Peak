import { useState } from "react"

import SettingSwitch from "@components/settings/SettingSwitch"
import Switch from "@components/common/Switch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value } from "@components/settings/Section"

import { postSubscription } from "@api/notifications.api"
import { getClientSettings, setClientSettingsByName } from "@/utils/clientSettings"
import { toast } from "react-toastify"

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

const Notifications = () => {
    const [subscription, setSubScription] = useState(() => getClientSettings()["push_notification_subscription"])

    const requestPush = async () => {
        const permission = await window.Notification.requestPermission()
        if (permission !== "granted") {
            toast.error("You declined notifications.", {toastId: "notification_permission_declined"})
            return
        }
        subscribePush()
    }

    const subscribePush = async () => {
        const registration = await navigator.serviceWorker.register("/service-worker.js")
        const publicKey = urlB64ToUint8Array("your-public-key-here")
        const options = {applicationServerKey: publicKey, userVisibleOnly: true}
        const subscription = await registration.pushManager.subscribe(options)
        await postSubscription(subscription)

        setClientSettingsByName("push_notification_subscription", subscription)
        setSubScription(subscription)
        toast.success("Notification enabled.", {toastId: "notification_enabled"})
    }

    return <>
        <PageTitle>Notifications</PageTitle>
        <Section>
            <Name>Receive push notifications</Name>
            <Description>If you disallow push notification permission of Peak, this option has no effect.</Description>
            <Value>
                <Switch checked={subscription !== null} onClick={requestPush} />
            </Value>
        </Section>
        <Section>
            <Name>Play notification sound</Name>
            <Value>
                <SettingSwitch name="play_notification_sound" />
            </Value>
        </Section>
    </>
}

export default Notifications