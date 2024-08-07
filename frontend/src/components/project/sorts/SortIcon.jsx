const SortIcon = ({ color }) => {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4.46154 1L1 6.76923M4.46154 1L7.92308 6.76923M4.46154 1V16"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.6923 16L17.1538 10.2308M13.6923 16L10.2307 10.2308M13.6923 16L13.6923 1"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default SortIcon
