const AlarmClock = ({ color }) => {
    return (
        <svg
            draggable="false"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_558_5100)">
                <path
                    d="M12 24.0799C18.0363 24.0799 23 19.3722 23 13.4799C23 7.58758 18.0363 2.87988 12 2.87988C5.96373 2.87988 1 7.58758 1 13.4799C1 19.3722 5.96373 24.0799 12 24.0799Z"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M18.0104 3.78539C21.0594 1.27629 25.2364 5.66342 21.6804 8.67294"
                    stroke={color}
                    strokeWidth="2"
                />
                <path
                    d="M6.07116 3.78539C3.02215 1.27629 -1.15487 5.66342 2.40112 8.67294"
                    stroke={color}
                    strokeWidth="2"
                />
                <path
                    d="M4.5 24.5201L6.5 22.1201M19 24.5201L17 22.1201"
                    stroke={color}
                    strokeWidth="2"
                />
                <path d="M12 1V3.88M10 1H14" stroke={color} />
                <path
                    d="M12 7V13L16 15"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_558_5100">
                    <rect width="24" height="25" fill="none" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default AlarmClock
