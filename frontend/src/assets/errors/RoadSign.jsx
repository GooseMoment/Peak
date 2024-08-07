import { ifMobile } from "@utils/useScreenType"

import styled, { useTheme } from "styled-components"

const RoadSign = ({text, spacing=10}) => {
    const theme = useTheme()

    const red = theme.primaryColors.danger
    const inner = theme.secondBackgroundColor
    const border = theme.grey
    const shadow = "#68686A"

    return <Svg width="356" height="258" viewBox="0 0 356 258" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.5" y="3.5" width="349" height="141" rx="28.5" stroke={border} strokeWidth="7"/>
        <rect x="22" y="22" width="312" height="104" rx="9" fill={inner} stroke={red} strokeWidth="14"/>
        <rect x="79" y="148" width="20" height="110" fill={border} />
        <rect x="79" y="148" width="20" height="13" fill={shadow} />
        <path d="M79 174V161H99L79 174Z" fill={shadow} />
        <rect x="257" y="148" width="20" height="110" fill={border} />
        <rect x="257" y="148" width="20" height="13" fill={shadow} />
        <path d="M257 174V161H277L257 174Z" fill={shadow} />
        <Text x="50%" y="95" textAnchor="middle">
            {[...text].map((letter, i) => <tspan key={letter + i} dx={i !== 0 ? spacing : 0}>{letter}</tspan>)}
        </Text>
    </Svg>
}

const Svg = styled.svg`

    ${ifMobile} {
        transform: scale(0.75);
    }
`

const Text = styled.text`
    fill: ${p => p.theme.textColor};
    font-size: 60px;
    font-weight: bold;
    text-align: center;
`

export default RoadSign
