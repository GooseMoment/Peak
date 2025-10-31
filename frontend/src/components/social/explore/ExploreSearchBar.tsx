import { ChangeEvent, KeyboardEvent, useRef, useState } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const ExploreSearchBar = ({
    handleSearch,
}: {
    handleSearch: (searchTerm: string) => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "social.explore" })

    const [searchTerm, setSearchTerm] = useState("")
    const timer = useRef<NodeJS.Timeout | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)

        if (timer.current) clearTimeout(timer.current)

        timer.current = setTimeout(async () => {
            handleSearch(e.target.value)
        }, 1500)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(searchTerm)

            if (!timer.current) return
            clearTimeout(timer.current)
        }
    }

    return (
        <Box>
            <SearchInput
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={t("searchbar")}
            />
            <SearchButton onClick={() => handleSearch(searchTerm)}>
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

        color: ${(props) => props.theme.social.buttonColor};
        stroke-width: 0.15em;
    }
`

export default ExploreSearchBar
