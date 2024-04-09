import styled from "styled-components"

import Detail from "@components/project/common/Detail"

import publicsvg from "@assets/project/privacy/public.svg"
import protectedsvg from "@assets/project/privacy/protected.svg"
import privatesvg from "@assets/project/privacy/private.svg"

const Privacy = ({setPrivacy, setDisplayPrivacy, closeComponent}) => {

    const changePrivacy = (privacy, displayPrivacy) => {
        return async () => {
            await setPrivacy(privacy)
            await setDisplayPrivacy(displayPrivacy)
            closeComponent()
        }
    }

    return (
        <Detail title="프로젝트 설정" onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText onClick={changePrivacy(item.privacy, item.display)}>{item.display}</ItemText>
                </ItemBlock>
            ))}
        </Detail>
    )
}

const ItemBlock = styled.div`
    display: flex;
    gap: 0.5em;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;

    & svg {
        width: 1.2em;
        height: 1.2em;
        stroke: none;
        top: 0;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: #000000;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;
    }
`

const items = [
    {icon: <img src={publicsvg}/>, display: "전체공개", privacy: "public"},
    {icon: <img src={protectedsvg}/>, display: "팔로워공개", privacy: "protected"},
    {icon: <img src={privatesvg}/>, display: "비공개", privacy: "private"}
]

export default Privacy