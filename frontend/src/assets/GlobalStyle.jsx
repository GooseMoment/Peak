import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
html {
    accent-color: ${(p) => p.theme.accentColor};
    scrollbar-color: ${(p) => p.theme.scrollbarColor} transparent;
}
`

export default GlobalStyle
