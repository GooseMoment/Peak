import styled, { useTheme } from "styled-components"

import SortIcon from "@components/project/sorts/SortIcon"

import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import "@szhsin/react-menu/dist/transitions/zoom.css"
import FeatherIcon from "feather-icons-react"

const SortMenu = ({ color, items, ordering, setOrdering }) => {
    const theme = useTheme()

    const textColor = theme.textColor
    const secondBackgroundColor = theme.secondBackgroundColor

    return (
        <Menu
            menuButton={
                <EmptyMenuBtn>
                    <SortIcon color={color} />
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
                paddingRight: "13px !important",
                fontSize: "13px",
            }}>
            {items.map((item) => (
                <StyledMenuItem
                    key={item.display}
                    onClick={() => setOrdering(item.context)}>
                    <EmptyBox $isSelected={item.context === ordering}>
                        <FeatherIcon icon="check" />
                    </EmptyBox>
                    {item.display}
                </StyledMenuItem>
            ))}
        </Menu>
    )
}

const EmptyMenuBtn = styled(MenuButton)`
    background-color: transparent;
    border: 0;
`

const EmptyBox = styled.div`
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

const StyledMenuItem = styled(MenuItem)`
    &:hover {
        background-color: ${(p) => p.theme.thirdBackgroundColor};
    }
`

export default SortMenu
