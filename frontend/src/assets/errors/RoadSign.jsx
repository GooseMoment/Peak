import styled, { useTheme } from "styled-components"

const RoadSign = ({text, spacing=10}) => {
    const theme = useTheme()

    const red = theme.primaryColors.danger
    const inner = theme.secondBackgroundColor
    const border = theme.grey
    const shadow = "#68686A"

    return <svg width="473" height="258" viewBox="0 0 473 258" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M161.045 90.375V82.0625L179.795 52.75H193.232V82H198.732V90.375H193.232V98H183.045V90.375H161.045ZM171.67 82H183.232V64.0625H182.857L171.67 81.625V82ZM237 98.625C225.25 98.625 218.062 90.2188 218.062 75.375C218.062 60.5312 225.25 52.125 237 52.125C248.75 52.125 255.969 60.5938 255.938 75.375C255.969 90.25 248.75 98.625 237 98.625ZM229 75.375C228.969 85.4062 232.188 89.9375 237 89.9375C241.812 89.9375 245.031 85.4062 245 75.375C245 65.5 241.812 60.7812 237 60.75C232.219 60.7812 229.031 65.5 229 75.375ZM275.58 90.375V82.0625L294.33 52.75H307.768V82H313.268V90.375H307.768V98H297.58V90.375H275.58ZM286.205 82H297.768V64.0625H297.393L286.205 81.625V82Z" fill="black"/>
        <rect x="3.5" y="3.5" width="466" height="141" rx="28.5" stroke={border} strokeWidth="7"/>
        <rect x="22" y="22" width="430" height="105" rx="9" fill={inner} stroke={red} strokeWidth="14"/>
        <rect x="121" y="148" width="20" height="110" fill={border} />
        <rect x="336" y="148" width="20" height="110" fill={border} />
        <rect x="121" y="148" width="20" height="13" fill={shadow} />
        <path d="M121 174V161H141L121 174Z" fill={shadow} />
        <rect x="336" y="148" width="20" height="13" fill={shadow} />
        <path d="M336 174V161H356L336 174Z" fill={shadow} />

        <Text x="50%" y="95" textAnchor="middle">
            {[...text].map((letter, i) => <tspan key={letter + i} dx={i !== 0 ? spacing : 0}>{letter}</tspan>)}
        </Text>
    </svg>
}

const Text = styled.text`
    fill: ${p => p.theme.textColor};
    font-size: 60px;
    font-weight: bold;
    text-align: center;
`

export default RoadSign
