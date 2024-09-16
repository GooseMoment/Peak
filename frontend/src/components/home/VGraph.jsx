import styled from "styled-components"

const VGraph = ({ items }) => {
    return (
        <Frame>
            <Graph>
                {items?.map((item) => (
                    <Item
                        key={item.name}
                        $width={item.width}
                        $color={item.color}
                    />
                ))}
            </Graph>
            <Categories>
                {items?.map((item) => (
                    <Category key={item.name}>
                        <CategoryCircle $color={item.color} /> {item.name}
                    </Category>
                ))}
            </Categories>
        </Frame>
    )
}

const Frame = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75em;
`

const Graph = styled.div`
    position: relative;
    border-radius: 32px;
    width: 100%;
    height: 2em;
    overflow: hidden;
`

const Item = styled.div`
    display: inline-block;
    width: ${(p) => p.$width}%;
    height: 100%;
    background-color: ${(p) => p.$color};
`

const Categories = styled.div`
    display: flex;
    justify-content: space-evenly;
`

const Category = styled.div`
    display: flex;
    gap: 0.25em;

    font-size: 0.75em;
    font-weight: bold;
`

const CategoryCircle = styled.div`
    border-radius: 50%;
    aspect-ratio: 1/1;
    height: 1em;
    background-color: ${(p) => p.$color};
`

export default VGraph
