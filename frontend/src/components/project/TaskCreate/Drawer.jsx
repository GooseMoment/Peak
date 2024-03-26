import styled from "styled-components"
import DetailFrame from "./DetailFrame"

const Drawer = () => {
    return (
        <DetailFrame title="서랍 선택">
            {mockDrawers.map(drawer => (
                <ItemBox key={drawer.id}>
                    <Circle $color={drawer.color}/>
                    <ItemText>{drawer.name}</ItemText>
                </ItemBox>
            ))}
        </DetailFrame>
    )
}

const Circle = styled.div`
    position: relative;
    width: 1.1em;
    height: 1.1em;
    background-color: ${props => props.$color};
    border-radius: 50%;
    margin-right: 0.6em;
`

const ItemBox = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-left: 1.2em;
    margin-top: 1.2em;
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

const mockDrawers = [
    {id: 0, name: "수강신청", project:"홍대라이프", color: "#2E61DC", uncompleted_task_count: 1, completed_task_count: 1},
    {id: 1, name: "고스락", project:"홍대라이프", color: "#2E61DC", uncompleted_task_count: 0, completed_task_count: 0},
]

export default Drawer