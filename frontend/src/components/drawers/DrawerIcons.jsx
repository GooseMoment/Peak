import styled from "styled-components"

import CollapseButton from "@components/common/CollapseButton"
import OptionsMenu from "@components/common/OptionsMenu"
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
    openSortMenMobile,
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
                <div onClick={openSortMenMobile}>
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
