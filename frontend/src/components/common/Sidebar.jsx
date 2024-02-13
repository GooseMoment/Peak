import styled from "styled-components"

const Sidebar = ({hide, setHide}) => {

    return <SidebarBox hide={hide}>
        <h1>This is Sidebar</h1>
        <button onClick={() => setHide(previous => !previous)}>Hide Sidebar</button>
    </SidebarBox>
}

const SidebarBox = styled.div`
background-color: #F9F7F6;
flex-basis: ${props => props.hide ? "0rem" : "18rem"};
transform: ${props => props.hide ? "translateX(-0%)" : "none"};
flex-grow: 1;

transition: transform 1s, flex-basis 1s;
transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

& button {
    float: right;
}
`

export default Sidebar