import styled, { css } from "styled-components"

import Navbar from "@components/navbar/Navbar"
import Sidebar from "@components/sidebar/Sidebar"
import { useSidebarContext } from "@components/sidebar/SidebarContext"

import { useClientSetting } from "@utils/clientSettings"
import { ifMobile, ifTablet } from "@utils/useScreenType"

const Layout = ({ children }) => {
    const [clientSetting] = useClientSetting()

    const contentPadding = clientSetting["main_width"] || "5rem"

    const { isCollapsed } = useSidebarContext()

    return (
        <App>
            <Navbar />
            <Sidebar />
            <Content
                $sidebarCollapsed={isCollapsed}
                $sidePadding={contentPadding}>
                {children}
            </Content>
        </App>
    )
}

const App = styled.div`
    background-color: ${(p) => p.theme.backgroundColor};
`

const Content = styled.main`
    padding: 3rem ${(props) => props.$sidePadding};
    padding-left: calc(${(props) => props.$sidePadding} + 18rem);

    ${(p) =>
        p.$sidebarCollapsed
            ? css`
                  padding: 3rem calc(${p.$sidePadding} + 7rem);
              `
            : null}

    min-height: 100dvh;
    box-sizing: border-box;
    color: ${(p) => p.theme.textColor};

    ${ifTablet} {
        padding: 2rem 1.75rem;
        padding-left: calc(6rem + 1.75rem);
    }

    ${ifMobile} {
        padding-top: max(env(safe-area-inset-top), 2rem);
        padding-right: max(env(safe-area-inset-right), 1.5rem);
        padding-bottom: calc(2rem + 6rem);
        padding-left: max(env(safe-area-inset-left), 1.5rem);
    }
`

// Reference: https://every-layout.dev/layouts/sidebar

export default Layout
