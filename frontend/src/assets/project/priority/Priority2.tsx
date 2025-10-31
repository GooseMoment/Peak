import { useTheme } from "styled-components"

const Priority2 = () => {
    const theme = useTheme()
    const color = theme.project.danger

    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2 11H2.01591"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2 2V7"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 2V7"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 11H8.01591"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default Priority2
