import { useRef, useState } from "react"

import Switch from "@components/common/Switch"

import { useClientSetting } from "@utils/clientSettings"

const SettingSwitch = ({submit, name, onlineSetting}) => {
    const [clientSetting, setClientSetting] = useClientSetting()
    const [value, setValue] = useState(onlineSetting ? onlineSetting[name] : clientSetting[name])

    const timer = useRef(null)

    const sendChangeOnline = () => {
        let data = {}
        data[name] = value
        submit(data)
        timer.current = null
    }

    const onChange = e => {
        const checked = e.target.checked
        setValue(checked)

        if (!onlineSetting) {
            setClientSetting(name, checked)
            return
        }

        if (timer.current !== null) {
            clearTimeout(timer.current)
        }

        timer.current = setTimeout(sendChangeOnline, 1000)
    }

    return <Switch checked={value} onChange={onChange} />
}

export default SettingSwitch