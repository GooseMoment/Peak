import { Dispatch, SetStateAction } from "react"

import styled from "styled-components"

import { compareFn } from "@utils/compareFn"

import FeatherIcon from "feather-icons-react"

export interface ICheckboxItem {
    name: string
    display: string
}

export type CheckboxGroupProp = {
    items: ICheckboxItem[]
    exclusive: boolean
    selectedItems: ICheckboxItem[]
    setSelectedItems: Dispatch<SetStateAction<ICheckboxItem[]>>
}

export default function CheckboxGroup({
    items,
    exclusive = false,
    selectedItems,
    setSelectedItems,
}: CheckboxGroupProp) {
    return (
        <GroupBox>
            {items.map((item) => (
                <Checkbox
                    key={item.name}
                    item={item}
                    exclusive={exclusive}
                    selected={selectedItems.some(
                        (arrItem) => arrItem.name === item.name,
                    )}
                    setSelectedItems={setSelectedItems}
                />
            ))}
        </GroupBox>
    )
}

type CheckboxProp = {
    item: ICheckboxItem
    exclusive: boolean
    selected: boolean
    setSelectedItems: Dispatch<SetStateAction<ICheckboxItem[]>>
}

const Checkbox = ({
    item,
    exclusive,
    selected = false,
    setSelectedItems,
}: CheckboxProp) => {
    const onChange = () => {
        if (selected) {
            return setSelectedItems((arr) =>
                arr.filter((arrItem) => arrItem.name != item.name),
            )
        }

        if (exclusive) {
            setSelectedItems([item])
        }

        setSelectedItems((arr) =>
            [...arr, item].sort((a, b) => compareFn(a.name, b.name)),
        )
    }

    return (
        <Box htmlFor={item.name} $selected={selected}>
            <HiddenInput
                type="checkbox"
                id={item.name}
                checked={selected}
                onChange={onChange}
            />
            <CheckWrapper $selected={selected}>
                <FeatherIcon icon={selected ? "check" : "plus-circle"} />
            </CheckWrapper>
            <Label htmlFor={item.name} $selected={selected}>
                {item.display}
            </Label>
        </Box>
    )
}

const Box = styled.label<{ $selected: boolean }>`
    display: flex;
    padding: 0.75em;
    border-radius: 16px;

    cursor: pointer;
    background-color: ${(p) =>
        p.$selected ? p.theme.secondBackgroundColor : "transparent"};
    transition: color 0.2s var(--cubic);
`

const HiddenInput = styled.input`
    display: none;
`

const CheckWrapper = styled.div<{ $selected: boolean }>`
    & svg {
        top: 0;
        stroke-width: 2.75px;
        cursor: pointer;
        color: ${(p) => (p.$selected ? p.theme.textColor : p.theme.grey)};
        transition: color 0.2s var(--cubic);
    }
`

const Label = styled.label<{ $selected: boolean }>`
    user-select: none;
    -webkit-user-select: none;

    cursor: pointer;

    color: ${(p) => (p.$selected ? p.theme.textColor : p.theme.grey)};
    transition: color 0.2s var(--cubic);
`

const GroupBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.25em;
`
