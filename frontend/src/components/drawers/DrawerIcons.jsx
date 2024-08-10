import styled, { css } from "styled-components"

import SortIcon from "@components/project/sorts/SortIcon"

import { DrawerIcon } from "./DrawerBox"

import handleToggleContextMenu from "@utils/handleToggleContextMenu"

import { cubicBeizer, rotateToUnder, rotateToUp } from "@assets/keyframes"

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
                    <SortIcon color={`${color}`} />
                </div>
            ),
        },
        {
            icon: (
                <CollapseButton $collapsed={collapsed}>
                    <FeatherIcon
                        icon="chevron-down"
                        onClick={handleCollapsed}
                    />
                </CollapseButton>
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

const CollapseButton = styled.div`
    & svg {
        animation: ${rotateToUp} 0.5s ${cubicBeizer} forwards;
    }

    ${(props) =>
        props.$collapsed &&
        css`
            & svg {
                animation: ${rotateToUnder} 0.5s ${cubicBeizer} forwards;
            }
        `}
`

const Button = styled.button`
    border: 0;
    background-color: transparent;
`

export default DrawerIcons
