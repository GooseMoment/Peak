import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

const Header = ({collapsed, setCollapsed}) => {
    return <div>
        <button onClick={() => setCollapsed(previous => !previous)}>
            <FeatherIcon icon={collapsed ? "chevrons-right" : "chevrons-left"} />
        </button>
        <LogoSkelton />
    </div>
}

const LogoSkelton = styled.div`
margin: 1em;
width: auto;
height: 5em;
background-color: salmon;
`

export default Header