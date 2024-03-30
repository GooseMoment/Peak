import Switch from "@components/settings/Switch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value } from "@components/settings/Section"

const Notifications = () => {

    return <>
        <PageTitle>Notifications</PageTitle>
        <Section>
            <Name>Send push notifications</Name>
            <Description>If you disallow push notification permission of Peak, this option has no effect.</Description>
            <Value>
                <Switch name="send_push_notifications" />
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