import styled from "styled-components"

import CollapseButton from "@components/common/CollapseButton"
import OptionsMenu from "@components/project/common/OptionsMenu"
import SortIcon from "@components/project/sorts/SortIcon"
import SortMenu from "@components/project/sorts/SortMenu"

import { DrawerIcon } from "./DrawerBox"

import useScreenType from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"

const DrawerIcons = ({
    color,
    collapsed,
    handleCollapsed,
    clickPlus,
    items,
    openSortMenuMobile,
    ordering,
    setOrdering,
    handleEdit,
    handleAlert,
}) => {
    const { isMobile } = useScreenType()

    const drawerIcons = [
        { icon: <FeatherIcon icon="plus" onClick={clickPlus} /> },
        {
            icon: isMobile ? (
                <div onClick={openSortMenuMobile}>
                    <SortIcon color={color} />
                </div>
            ) : (
                <SortMenu
                    color={color}
                    items={items}
                    ordering={ordering}
                    setOrdering={setOrdering}
                />
            ),
        },
        {
            icon: (
                <CollapseButton
                    collapsed={collapsed}
                    handleCollapsed={handleCollapsed}
                />
            ),
        },
        {
            icon: (
                <OptionsMenu
                    color={color}
                    handleAlert={handleAlert}
                    handleEdit={handleEdit}
                />
            ),
        },
    ]

    return (
        <DrawerIcon $color={color}>
            {drawerIcons.map((item, i) => (
                <IconBox key={i}>{item.icon}</IconBox>
            ))}
        </DrawerIcon>
    )
}

const IconBox = styled.div`
    width: 1em;
    height: 1em;
    margin: 0.5em;
    border: 0;
    background-color: transparent;
`

export default DrawerIcons
