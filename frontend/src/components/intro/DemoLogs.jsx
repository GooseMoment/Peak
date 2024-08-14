import styled from "styled-components"

import UserProfile from "@components/intro/UserProfile"

import { cubicBeizer } from "@assets/keyframes"

const DemoLogs = ({ logs, selected, setSelected }) => {
    return (
        <LogGroup>
            {logs.map((log, index) => (
                <Log
                    key={log.username}
                    $selected={index === selected}
                    onClick={() => setSelected(index)}>
                    <UserProfile
                        username={log.username}
                        colors={log.colors}
                        profileImg={log.profile_img}
                    />
                    <Preview>{log.preview}</Preview>
                </Log>
            ))}
        </LogGroup>
    )
}

const LogGroup = styled.div`
    flex-grow: 1;
    flex-basis: 50%;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const Log = styled.article`
    display: flex;
    gap: 1em;

    background-color: ${(p) =>
        p.$selected
            ? p.theme.introBackgroundColor
            : p.theme.thirdBackgroundColor};

    transition: background-color 0.25s ${cubicBeizer};

    border-radius: 20px;
    padding: 0.75em;

    cursor: pointer;
`

const Preview = styled.div`
    flex-grow: 99;
    display: flex;
    align-items: center;
    justify-content: center;
`

export default DemoLogs
