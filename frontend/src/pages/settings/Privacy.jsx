import Loading from "@components/settings/Loading"
import Error from "@components/settings/Error"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value, Sync } from "@components/settings/Section"
import Switch from "@components/settings/SettingSwitch"
import Select from "@components/settings/Select"

import { getSettings, patchSettings } from "@api/user_setting.api"

import queryClient from "@queries/queryClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

const Privacy = () => {
    const {data: settings, isPending, isError} = useQuery({
        queryKey: ["settings"],
        queryFn: () => getSettings(),
    })

    const mutation = useMutation({
        mutationFn: (data) => {
            return patchSettings(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["settings"]})
            toast.success("Setting was saved on the server.")
        },
    })

    if (isPending) {
        return <Loading />
    }

    if (isError) {
        return <Error />
    }

    return <>
        <PageTitle>Privacy <Sync /></PageTitle>
        <Section>
            <Name>Accept follow manually</Name>
            <Description>Follow requests will be pending until you accept them.</Description>
            <Value>
                <Switch 
                    onlineSetting={settings} submit={mutation.mutate}
                    name="follow_request_approval_manually"
                />
            </Value>
        </Section>

        <Section>
            <Name>Accept follows of your followings automatically</Name>
            <Description>If one of your followings sends you follow request, you accept it without your action.</Description>
            <Value>
                <Switch 
                    onlineSetting={settings} submit={mutation.mutate}
                    name="follow_request_approval_for_followings" 
                />
            </Value>
        </Section>

        <Section>
            <Name>Visibility of my followings & followers list</Name>
            <Description>You can set who can see your personal connections.</Description>
            <Value>
                <Select
                    onlineSetting={settings} submit={mutation.mutate}
                    name="follow_list_privacy" choices={privacyChoices} 
                />
            </Value>
        </Section>
    </>
}

const privacyChoices = [
    {
        display: "Everyone",
        value: "public",
    },
    {
        display: "Limit to my followers",
        value: "protected",
    },
    {
        display: "Only me",
        value: "private",
    },
]

export default Privacy