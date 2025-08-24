import { type ChangeEvent, useState } from "react"

import styled from "styled-components"

import type { UserSetting } from "@api/user_setting.api"

import { type ClientSetting, useClientSetting } from "@utils/clientSettings"

type StringLiteralKeysOf<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends string
        ? string extends NonNullable<T[K]>
            ? never
            : K
        : never
}[keyof T]

type SelectProps<K extends StringLiteralKeysOf<ClientSetting>> = {
    // ClientSetting key whose value type is string literal union
    name: K
    choices: Array<{
        display: string
        value: ClientSetting[K]
    }>
}

export default function Select<K extends StringLiteralKeysOf<ClientSetting>>({
    name,
    choices,
}: SelectProps<K>) {
    const [clientSetting, setClientSetting] = useClientSetting()

    const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setClientSetting(name, e.target.value as ClientSetting[K])
    }

    return (
        <StyledSelect onChange={onChange} defaultValue={clientSetting[name]}>
            {choices.map((choice) => (
                <option key={choice.value} value={choice.value}>
                    {choice.display}
                </option>
            ))}
        </StyledSelect>
    )
}

interface UserSettingSelectProps<K extends StringLiteralKeysOf<UserSetting>> {
    name: K
    choices: Array<{
        display: string
        value: UserSetting[K]
    }>
    submit: (data: Partial<UserSetting>) => void
    userSetting: UserSetting
}

export function UserSettingSelect<K extends StringLiteralKeysOf<UserSetting>>({
    name,
    choices,
    submit,
    userSetting,
}: UserSettingSelectProps<K>) {
    const [value, setValue] = useState(userSetting[name])

    const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as UserSetting[K]
        setValue(newValue)
        submit({ [name]: newValue })
    }

    return (
        <StyledSelect onChange={onChange} defaultValue={value}>
            {choices.map((choice) => (
                <option key={choice.value} value={choice.value}>
                    {choice.display}
                </option>
            ))}
        </StyledSelect>
    )
}

// from: https://codepen.io/vkjgr/pen/VYMeXp
const StyledSelect = styled.select`
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};

    border: thin solid ${(p) => p.theme.textColor};
    border-radius: 4px;
    display: inline-block;
    font: inherit;
    line-height: 1.5em;
    padding: 0.5em 3.5em 0.5em 1em;

    max-width: 100%;

    margin: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    background-image:
        linear-gradient(45deg, transparent 50%, gray 50%),
        linear-gradient(135deg, gray 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
    background-position:
        calc(100% - 20px) calc(1em + 2px),
        calc(100% - 15px) calc(1em + 2px),
        calc(100% - 2.5em) 0.5em;
    background-size:
        5px 5px,
        5px 5px,
        1px 1.5em;
    background-repeat: no-repeat;

    cursor: pointer;

    &:focus {
        background-repeat: no-repeat;
        border-color: green;
        outline: 0;
    }
`
