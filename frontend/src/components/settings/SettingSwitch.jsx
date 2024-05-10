import { useRef, useState } from "react"

import Switch from "@components/common/Switch"

import { useClientSetting } from "@utils/clientSettings"

const SettingSwitch = ({submit, name, online=false}) => {
    const [clientSetting, setClientSetting] = useClientSetting()
    const [value, setValue] = useState(clientSetting[name])

    const timer = useRef(null)

    const sendChangeOnline = () => {
        let data = {}
        data[name] = value
        submit(data, {action: "..", method: "PATCH", navigate: false})
        timer.current = null
    }

    const onChange = e => {
        const checked = e.target.checked
        setValue(checked)

        if (!online) {
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