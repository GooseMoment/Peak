import { useRef, useState } from "react"

import styled from "styled-components"

import { getExploreSearchResults } from "@api/social.api"

import FeatherIcon from "feather-icons-react"

const SearchBar = ({ handleSearch }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const timer = useRef(null)

    const handleChange = (e) => {
        setSearchTerm(e.target.value)

        if (timer.current) clearTimeout(timer.current)

        timer.current = setTimeout(async () => {
            handleSearch({searchTerm: e.target.value})
        }, 1000)
    }

    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            handleSearch({searchTerm})
        }
    }

    return (
        <Box>
            <FeatherIcon icon={"search"} />
            <SearchInput value={searchTerm} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Box>
    )
}

const Box = styled.div`
    height: 2em;

    border-radius: 0.7em;
    background-color: #f0f0f0;
    padding: 0.2em 0.7em 0.2em;

    font-size: 1.2em;

    display: flex;
    align-items: center;
    gap: 0.5em;

    & svg {
        top: unset;
        margin-right: unset;
        height: 100%;

        color: #d9d9d9;
        stroke-width: 0.15em;
    }
`

const SearchInput = styled.input`
    flex-grow: 1;

    font-size: 1em;
`

export default SearchBar
