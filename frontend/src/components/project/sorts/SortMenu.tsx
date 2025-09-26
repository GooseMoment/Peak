import { Dispatch, SetStateAction } from "react"

import styled from "styled-components"

import SortIcon from "@components/project/sorts/SortIcon"

import { Menu, MenuItem } from "@assets/menu"

import { MenuButton } from "@szhsin/react-menu"
import FeatherIcon from "feather-icons-react"

const SortMenu = ({
    color,
    items,
    ordering,
    setOrdering,
}: {
    color: string
    items: {
        display: string
        context: string
    }[]
    ordering: string
    setOrdering: Dispatch<SetStateAction<string>>
}) => {
    return (
        <Menu
            menuButton={
                <EmptyMenuBtn>
                    <SortIcon color={color} />
                </EmptyMenuBtn>
            }
            transition
            align="end">
            {items.map((item) => (
                <MenuItem
                    key={item.display}
                    onClick={() => setOrdering(item.context)}>
                    <EmptyBox $isSelected={item.context === ordering}>
                        <FeatherIcon icon="check" />
                    </EmptyBox>
                    {item.display}
                </MenuItem>
            ))}
        </Menu>
    )
}

const EmptyMenuBtn = styled(MenuButton)`
    background-color: transparent;
    border: 0;
`

const EmptyBox = styled.div<{ $isSelected: boolean }>`
    width: 16px;
    height: 16px;
    margin-right: 0.5em;

    & svg {
        stroke: ${(props) =>
            props.$isSelected
                ? props.theme.primaryColors.success
                : "transparent"};
    }
`

export default SortMenu
