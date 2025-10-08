import styled from "styled-components"

import type { Privacy } from "@api/common"

import FeatherIcon from "feather-icons-react"

const PrivacyIcon = ({
    privacy,
    color,
    isProject = false,
}: {
    privacy: Privacy | null
    color: string
    isProject?: boolean
}) => {
    if (privacy === "public" || privacy === null) {
        return null
    }

    const icon =
        privacy === "protected" ? (
            <FeatherIcon icon="users" />
        ) : (
            <FeatherIcon icon="lock" />
        )

    if (isProject) {
        return <ProjectPrivacyBox $color={color}>{icon}</ProjectPrivacyBox>
    } else {
        return <DrawerPrivacyBox $color={color}>{icon}</DrawerPrivacyBox>
    }
}

const ProjectPrivacyBox = styled.div<{ $color: string }>`
    margin-left: 0.6em;
    padding-bottom: 0.8em;

    & svg {
        width: 20px;
        height: 20px;
        stroke-width: 3.5px;
        stroke: ${(props) => props.$color};
    }
`

const DrawerPrivacyBox = styled.div<{ $color: string }>`
    margin-bottom: 0.1em;
    margin-left: 0.6em;

    & svg {
        stroke-width: 3.5px;
        stroke: ${(props) => props.$color};
    }
`

export default PrivacyIcon
