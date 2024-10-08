import styled from "styled-components"

import UserProfile from "@components/intro/UserProfile"

import { cubicBeizer } from "@assets/keyframes"

const DemoLogs = ({ logs, visibleLogIndexes, selected, setSelected }) => {
    return (
        <LogGroup>
            {visibleLogIndexes.map((index) => (
                <Log
                    key={logs[index].username}
                    $selected={index === selected}
                    onClick={() => setSelected(index)}>
                    <UserProfile
                        username={logs[index].username}
                        colors={logs[index].colors}
                        profileImg={logs[index].profile_img}
                    />
                    <Preview>{logs[index].preview}</Preview>
                </Log>
            ))}
        </LogGroup>
    )
}

const LogGroup = styled.div`
    flex: 1 1 50%;

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

    transition:
        background-color 0.25s ${cubicBeizer},
        border-color 0.25s ${cubicBeizer};

    border-radius: 20px;
    padding: 0.5em 1em;

    border: solid 3px transparent;

    cursor: pointer;

    &:hover {
        border-color: ${(p) => p.theme.introBackgroundColor};
    }
`

const Preview = styled.div`
    flex-grow: 99;
    display: flex;
    align-items: center;
    justify-content: center;
`

export default DemoLogs
