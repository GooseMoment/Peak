import { styled, css } from "styled-components"

const SimpleProfile = ({user, ringColor}) => {
    return <Profile>
        <ProfileImg $color={ringColor}>
            <img src={user.profile_img}/>
        </ProfileImg>
        <Username>
            @{user.username}
        </Username>
    </Profile>
}

const Profile = styled.div`
height: 5em;
width: 5em;
text-align: center;
`

const ProfileImg = styled.div`
position: relative;
width: auto;
height: 3em;
padding-top: 0.5em;
padding-bottom: 0.5em;

& img {
    border-radius: 50%;
}

& svg {
    stroke: 2em;
    margin-right: 0;
}

& img, & svg {
    width: auto;
    height: 3em;
    ${props => props.$color ? css`
        box-shadow: 0 0 0 2.5px #FEFDFC, 0 0 0 5px #${props => props.$color};    
    ` : null
    }
}
`

const Username = styled.div`
font-size: 1em;
text-align: center;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`

export default SimpleProfile