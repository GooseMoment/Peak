const Hourglass = ({ color }: { color?: string }) => {
    return (
        <svg
            width="22"
            height="25"
            viewBox="0 0 22 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2 2H20"
                stroke={color}
                strokeWidth="2.3"
                strokeLinecap="round"
            />
            <path
                d="M2 23H20"
                stroke={color}
                strokeWidth="2.3"
                strokeLinecap="round"
            />
            <path
                d="M4.25 2V7.52632L17.75 17.1667V23"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="bevel"
            />
            <path
                d="M17.75 2V7.52632L4.25 17.1667V23"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="bevel"
            />
        </svg>
    )
}

export default Hourglass
