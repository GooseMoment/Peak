import styled from "styled-components"

import FeatherIcon from "feather-icons-react"

const PrivacyIcon = ({ privacy, color, isProject }) => {
    if (privacy === "public") {
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

const ProjectPrivacyBox = styled.div`
    margin-left: 0.8em;
    padding-bottom: 0.8em;

    & svg {
        width: 20px;
        height: 20px;
        stroke-width: 3.5px;
        stroke: ${(props) => props.$color};
    }
`

const DrawerPrivacyBox = styled.div`
    margin-left: 0.8em;

    & svg {
        stroke-width: 3.5px;
        stroke: ${(props) => props.$color};
    }
`

export default PrivacyIcon
