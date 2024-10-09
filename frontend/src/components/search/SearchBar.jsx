import { useRef, useState } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import FeatherIcon from "feather-icons-react"

const SearchBar = ({ handleSearch }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const timer = useRef(null)

    const handleChange = (e) => {
        setSearchTerm(e.target.value)

        if (timer.current) clearTimeout(timer.current)

        timer.current = setTimeout(async () => {
            setSearchTerm(e.target.value.trim())
            handleSearch(e.target.value.trim())
        }, 1500)
    }

    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            clearTimeout(timer.current)
            setSearchTerm(e.target.value.trim())
            handleSearch(e.target.value.trim())
        }
    }

    return (
        <Wrapper>
            <Box>
                <SearchInput
                    value={searchTerm}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <SaerchButton>
                    <FeatherIcon icon={"search"} />
                </SaerchButton>
            </Box>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
`

const Box = styled.div`
    margin-top: 0.5em;
    width: 70%;
    height: 2.5em;

    border-radius: 1.5em;
    overflow: hidden;
    background-color: ${(props) => props.theme.secondBackgroundColor};

    display: flex;
`

const SearchInput = styled.input`
    flex-grow: 1;

    padding: 0 0 0 1em;

    font-size: 1em;
`

const SaerchButton = styled(MildButton)`
    height: 2.5em;
    width: 2.5em;

    border-radius: 1.5em;
    padding: 0.25em;
    background-color: ${(p) => p.theme.primaryColors.secondary};
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

export default SearchBar
