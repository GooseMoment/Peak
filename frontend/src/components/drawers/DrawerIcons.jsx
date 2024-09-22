import styled from "styled-components"

import CollapseButton from "@components/common/CollapseButton"
import SortIcon from "@components/project/sorts/SortIcon"

import { DrawerIcon } from "./DrawerBox"

import handleToggleContextMenu from "@utils/handleToggleContextMenu"

import FeatherIcon from "feather-icons-react"

const DrawerIcons = ({
    color,
    collapsed,
    handleCollapsed,
    clickPlus,
    setIsSortMenuOpen,
    setSelectedSortMenuPosition,
    setIsContextMenuOpen,
    setSelectedContextPosition,
}) => {
    const drawerIcons = [
        { icon: <FeatherIcon icon="plus" onClick={clickPlus} /> },
        {
            icon: (
                <div
                    onClick={handleToggleContextMenu(
                        setSelectedSortMenuPosition,
                        setIsSortMenuOpen,
                        setIsContextMenuOpen,
                    )}
                >
                    <SortIcon color={color} />
                </div>
            ),
        },
        {
            icon: (
                <CollapseButton collapsed={collapsed} handleCollapsed={handleCollapsed}/>
            ),
        },
        {
            icon: (
                <FeatherIcon
                    icon="more-horizontal"
                    onClick={handleToggleContextMenu(
                        setSelectedContextPosition,
                        setIsContextMenuOpen,
                        setIsSortMenuOpen,
                    )}
                />
            ),
        },
    ]

    return (
        <DrawerIcon $color={color}>
            {drawerIcons.map((item, i) => (
                <Button key={i}>{item.icon}</Button>
            ))}
        </DrawerIcon>
    )
}

const Button = styled.button`
    border: 0;
    background-color: transparent;
`

export default DrawerIcons
