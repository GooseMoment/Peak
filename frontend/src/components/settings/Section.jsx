import cloudIcon from "@assets/settings/cloud.svg"

import styled from "styled-components"

const Section = styled.section`
    margin-top: 2em;

    &::after {
        display: block; 
        height: 0; 
        content: ' ';
        clear: both;
    }
`

export const Name = styled.h2`
`

export const Description = styled.span`
    display: block;
    margin-top: 1em;
    font-weight: 400;
    font-size: 0.8em;
    line-height: 140%;
    color: grey;
`

export const Value = styled.div`
    margin-top: 1.5em;
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
