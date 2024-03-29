import cloudIcon from "@assets/settings/cloud.svg"

import styled from "styled-components"

const Section = styled.section`
    margin-top: 2em;
`

export const Name = styled.h2`
    font-weight: 600;
`

export const Description = styled.span`
    margin-top: 1.25em;
    font-weight: 400;
    font-size: 0.8em;
    color: grey;
`

export const Value = styled.div`
    margin-top: 1.25em;
`

const SyncStyleIcon = styled.img`
    position: relative;
    color: orange;
    top: .13em;
    width: 0.75em;
    height: 0.75em;
    margin-left: 0.1em;
`

export const Sync = () => {
    return <label title="This setting is synchronized across all your devices.">
        <SyncStyleIcon src={cloudIcon} />
    </label>
} 

export default Section
