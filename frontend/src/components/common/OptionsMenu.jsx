import styled, { useTheme } from "styled-components"

import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu"
import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const OptionsMenu = ({ color = null, handleEdit, handleAlert }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const theme = useTheme()

    const textColor = theme.textColor
    const dangerColor = theme.primaryColors.danger
    const thirdBackgroundColor = theme.thirdBackgroundColor
    const secondBackgroundColor = theme.secondBackgroundColor

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
            align="end"
            menuStyle={{
                position: "absolute",
                backgroundColor: secondBackgroundColor,
                color: textColor,
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                padding: "13px 0px !important",
                fontSize: "13px",
            }}>
            <StyledMenuItem
                onClick={handleEdit}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                        thirdBackgroundColor)
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }>
                <FeatherIcon icon="edit" stroke={textColor} />
                {t("edit.display")}
            </StyledMenuItem>
            <StyledMenuItem
                onClick={handleAlert}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                        thirdBackgroundColor)
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }>
                <FeatherIcon icon="trash-2" stroke={dangerColor} />
                {t("delete.display")}
            </StyledMenuItem>
        </Menu>
    )
}

const EmptyMenuBtn = styled(MenuButton)`
    background-color: transparent;
    border: 0;
`

const StyledMenuItem = styled(MenuItem)`
    & svg {
        margin-right: 10px;
        margin-bottom: 3px;
    }
`

export default OptionsMenu
