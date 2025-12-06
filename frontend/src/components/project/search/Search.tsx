import { useState } from "react"

import styled, { useTheme } from "styled-components"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"

const Search = () => {
    const [isEditMode, setIsEditMode] = useState<Boolean>(false)

    return (
        <>
            <SearchIcon>
                <FeatherIcon
                    icon="search"
                    onClick={() => setIsEditMode(prev => !prev)}
                />
            </SearchIcon>

            {isEditMode &&
                <SearchBox>
                    just a test
                </SearchBox>
            }
        </>
    )
}

const SearchIcon = styled.div`
    margin-left: 0.8em;
    padding-bottom: 0.8em;
    cursor: pointer;

    min-width: 3em;

    & svg {
        width: 16px;
        height: 16px;
        top: 0;
    }
`

const SearchBox = styled.div``

export default Search