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
            handleSearch({ searchTerm: e.target.value })
        }, 1000)
    }

    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            handleSearch({ searchTerm })
        }
    }

    return (
        <Box>
            <SearchInput
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <SearchButton onClick={() => handleSearch({ searchTerm })}>
                <FeatherIcon icon={"search"} />
            </SearchButton>
        </Box>
    )
}

const Box = styled.div`
    height: 2em;

    border-radius: 0.7em;
    background-color: ${(p) => p.theme.secondBackgroundColor};
    padding: 0.2em 1em 0.2em;

    font-size: 1.2em;

    display: flex;
    align-items: center;
    gap: 1em;
`

const SearchInput = styled.input`
    flex-grow: 1;

    font-size: 1em;
`

const SearchButton = styled(MildButton)`
    & svg {
        top: unset;
        margin-right: unset;
        height: 100%;

        color: #a9a9a9;
        stroke-width: 0.15em;
    }
`

export default SearchBar
