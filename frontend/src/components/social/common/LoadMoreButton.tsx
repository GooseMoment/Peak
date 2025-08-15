import styled from "styled-components"

import Button from "@components/common/Button"

export default styled(Button)`
    display: flex;
    justify-content: space-between;
    width: 100%;

    &:active:hover:enabled {
        transform: scale(0.975);
    }

    & svg {
        top: 0;
        margin-right: 0;
    }
`
