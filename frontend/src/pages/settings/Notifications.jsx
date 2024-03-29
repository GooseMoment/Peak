import Switch from "@components/settings/Switch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value, Sync } from "@components/settings/Section"
import { useState } from "react"

const Notifications = () => {
    const [allowPushNotification, setAllowPushNotification] = useState(true)

    return <>
        <PageTitle>Notifications</PageTitle>
        <Section>
            <Name>Send push notifications</Name>
            <Description>If you disallow push notification permission of Peak, this option has no effect.</Description>
            <Value>
                <Switch isActive={allowPushNotification} setIsActive={setAllowPushNotification} />
            </Value>
        </Section>
        <Section>
            <Name>Notification sound</Name>
            <Value>
                <Switch isActive={allowPushNotification} setIsActive={setAllowPushNotification} />
            </Value>
        </Section>
    </>
}

export default Notifications