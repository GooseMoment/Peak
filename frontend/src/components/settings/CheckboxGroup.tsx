import { Dispatch, SetStateAction } from "react"

import styled from "styled-components"

import { compareFn } from "@utils/compareFn"

import FeatherIcon from "feather-icons-react"

interface ICheckboxItem {
    name: string
    display: string
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
        <Box htmlFor={item.name}>
            <HiddenInput
                type="checkbox"
                id={item.name}
                checked={selected}
                onChange={onChange}
            />
            <CheckWrapper $selected={selected}>
                <FeatherIcon icon="check" />
            </CheckWrapper>
            <Label htmlFor={item.name} $selected={selected}>
                {item.display}
            </Label>
        </Box>
    )
}

type CheckboxGroupProp = {
    items: ICheckboxItem[]
    exclusive: boolean
    selectedItems: ICheckboxItem[]
    setSelectedItems: Dispatch<SetStateAction<ICheckboxItem[]>>
}

const CheckboxGroup = ({
    items,
    exclusive = false,
    selectedItems,
    setSelectedItems,
}: CheckboxGroupProp) => {
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

const Box = styled.div`
    display: flex;
    padding: 0.5em 0;
`

const HiddenInput = styled.input`
    display: none;
`

const CheckWrapper = styled.div<{ $selected: boolean }>`
    & svg {
        stroke-dasharray: 40;
        stroke-dashoffset: ${(p) => (p.$selected ? 0 : 40)};
        stroke-width: 3px;
        transition: stroke-dashoffset 0.2s ease 0.1s;
    }
`

const Label = styled.label<{ $selected: boolean }>`
    user-select: none;
    -webkit-user-drag: none;

    color: ${(p) => (p.$selected ? p.theme.textColor : p.theme.grey)};
    transition: color 0.2s ease 0.1s;
`

const GroupBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

export default CheckboxGroup
