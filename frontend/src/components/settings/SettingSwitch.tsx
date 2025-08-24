import { type ChangeEvent, useRef, useState } from "react"

import Switch from "@components/common/Switch"

import type { UserSetting } from "@api/user_setting.api"

import { type ClientSetting, useClientSetting } from "@utils/clientSettings"

interface ClientSettingSwitchProps {
    // ClientSetting key whose value type is boolean
    name: {
        [K in keyof ClientSetting]-?: NonNullable<
            ClientSetting[K]
        > extends boolean
            ? K
            : never
    }[keyof ClientSetting]
}

export default function ClientSettingSwitch({
    name,
}: ClientSettingSwitchProps) {
    const [clientSetting, setClientSetting] = useClientSetting()

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setClientSetting(name, e.target.checked)
    }

    return <Switch checked={clientSetting[name]} onChange={onChange} />
}

interface UserSettingSwitchProps {
    name: {
        [K in keyof UserSetting]-?: NonNullable<UserSetting[K]> extends boolean
            ? K
            : never
    }[keyof UserSetting]
    userSetting: UserSetting
    submit: (data: Partial<UserSetting>) => void
}

export function UserSettingSwitch({
    name,
    userSetting,
    submit,
}: UserSettingSwitchProps) {
    const [value, setValue] = useState(userSetting[name])

    const timer = useRef<NodeJS.Timeout | null>(null)

    const sendChangeOnline = () => {
        submit({ [name]: value })
        timer.current = null
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        setValue(checked)

        if (timer.current !== null) {
            clearTimeout(timer.current)
        }

        timer.current = setTimeout(sendChangeOnline, 1000)
    }

    return <Switch checked={value} onChange={onChange} />
}
