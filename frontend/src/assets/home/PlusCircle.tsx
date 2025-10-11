import { useTheme } from "styled-components"

const PlusCircle = () => {
    const theme = useTheme()

    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Add">
            <circle cx="16" cy="16" r="16" fill={theme.grey} />
            <path
                d="M16 10.167V21.8337"
                stroke={theme.textColor}
                strokeWidth="2.35294"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.1667 16H21.8334"
                stroke={theme.textColor}
                strokeWidth="2.35294"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default PlusCircle
