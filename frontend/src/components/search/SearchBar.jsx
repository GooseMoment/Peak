import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import FeatherIcon from "feather-icons-react"

const SearchBar = () => {
    return (
        <Wrapper>
            <Box>
                <SaerchButton>
                    <FeatherIcon icon={"search"} />
                </SaerchButton>
                <SearchInput />
            </Box>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
`

const Box = styled.div`
    width: 80%;
    height: 2.5em;

    border-radius: 1.5em;
    overflow: hidden;
    background-color: ${props => props.theme.secondBackgroundColor};

    display: flex;
`

const SaerchButton = styled(MildButton)`
    height: 2.5em;
    width: 2.5em;

    border-radius: 1.5em;
    padding: 0.25em;
    background-color: ${p => p.theme.primaryColors.secondary};
    justify-content: center;
    align-items: center;

    svg {
        top: unset;
        margin-right: unset;
        height: 100%;

        color: ${(props) => props.theme.search.buttonColor};
        stroke-width: 0.15em;
    }
`

const SearchInput = styled.input`
    flex-grow: 1;

    padding: 0 0.5em 0;

    font-size: 1em;
`

export default SearchBar
