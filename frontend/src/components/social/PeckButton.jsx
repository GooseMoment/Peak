import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

const PeckButton = ({id, num}) => {
    return <Peck>
        <PeakNum>{num}</PeakNum>
        <FeatherIcon icon="send"/>
    </Peck>
}

const Peck = styled.div`
padding: 0.5em;

height: 1em;
`
const PeakNum = styled.div`
display: inline-block;
margin-right: 1rem;
`

export default PeckButton