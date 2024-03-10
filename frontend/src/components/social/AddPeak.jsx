import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

const AddPeak = ({id, num}) => {
    return <Peak>
        <PeakNum>{num}</PeakNum>
        <FeatherIcon icon="send"/>
    </Peak>
}

const Peak = styled.div`
padding: 0.5em;

height: 1em;
`
const PeakNum = styled.div`
display: inline-block;
margin-right: 1rem;
`

export default AddPeak