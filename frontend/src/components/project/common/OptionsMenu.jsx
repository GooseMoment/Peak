import styled, { useTheme } from "styled-components"

import { Menu, MenuItem } from "@assets/menu"

import { MenuButton } from "@szhsin/react-menu"
import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const OptionsMenu = ({ color = null, handleEdit, handleAlert }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const theme = useTheme()

    const textColor = theme.textColor
    const dangerColor = theme.primaryColors.danger

    return (
        <Menu
            menuButton={
                <EmptyMenuBtn>
                    <FeatherIcon
                        icon="more-horizontal"
                        stroke={color || textColor}
                    />
                </EmptyMenuBtn>
            }
            transition
            align="end">
            <MenuItem onClick={handleEdit}>
                <FeatherIcon icon="edit" stroke={textColor} />
                {t("edit.display")}
            </MenuItem>
            <MenuItem onClick={handleAlert}>
                <FeatherIcon icon="trash-2" stroke={dangerColor} />
                {t("delete.display")}
            </MenuItem>
        </Menu>
    )
}

const EmptyMenuBtn = styled(MenuButton)`
    background-color: transparent;
    border: 0;
`

export default OptionsMenu
