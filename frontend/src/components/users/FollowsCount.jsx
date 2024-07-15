import styled from "styled-components"

const FollowsCount = ({followers, followings}) => {
    return <Items>
        <Item>Followers <Count>{followers}</Count></Item>
        <Item>Followings <Count>{followings}</Count></Item>
    </Items>
}

const Items = styled.div`
    display: flex;
    gap: 1em;
`

const Item = styled.div`
    
`

const Count = styled.span`
    font-weight: 700;
`

export default FollowsCount
