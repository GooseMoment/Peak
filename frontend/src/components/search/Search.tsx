import { ChangeEvent, useRef, useState } from "react"

import styled, { useTheme } from "styled-components"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

interface SearchProps {
    searchQuery: string
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

const Search = ({searchQuery, setSearchQuery}: SearchProps) => {
    const { t } = useTranslation("translation", { keyPrefix: "search" })

    const [searchInput, setSearchInput] = useState("")
    

    const inputRef = useRef<HTMLInputElement>(null)
    const debounceTimerRef = useRef<number | null>(null)
    const lastSearchRef = useRef<{ q: string; ts: number } | null>(null)

    // temporary stub
    const handleExecuteSearch = (query: string) => {
        const now = Date.now()
        
        setSearchInput(query)

        // 최근 같은 쿼리로 서칭되면 무시 (중복 방지)
        // TODO: ref 대신 실 search 천에 퀴리만 이전과 비교하며, 같은 쿼리에 새로운 결과를 얻고 싶어하는 경우를 고려할 것.
        if (
            lastSearchRef.current &&
            lastSearchRef.current.q === query
        ) {
            return
        }
        lastSearchRef.current = { q: query, ts: now }

        setSearchQuery(query)
    }

    // Start input process
    const handleClick = () => {
        inputRef.current?.focus()
    }

    // Edit query
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)

        // Debounce
        if (debounceTimerRef.current !== null) {
            window.clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = window.setTimeout(() => {
            const trimmed = e.target.value.trim()
            handleExecuteSearch(trimmed)
        }, 1000)
    }

    // End and search
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            const trimed = searchInput.trim()
            handleExecuteSearch(trimed)
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const trimed = e.target.value.trim()
        handleExecuteSearch(trimed)
    }

    return (
        <SearchContainer>
            <SearchBox>
                <SearchIcon>
                    <FeatherIcon
                        icon="search"
                        onClick={handleClick}
                    />
                </SearchIcon>

                <InputBox
                    ref={inputRef}
                    type="text"
                    placeholder={t("placeholder")}
                    value={searchInput}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                />
            </SearchBox>
            <FiltersContainer>
                <FilterBox>123</FilterBox>
                <FilterBox>123</FilterBox>
                <FilterBox>123</FilterBox>
                <FilterBox>123</FilterBox>
            </FiltersContainer>
        </SearchContainer>
    )
}

const SearchContainer = styled.div`
    flex: 1;
    margin-top: 0.3em;

    display: flex;
    flex-direction: column;
`

const SearchBox = styled.div`
    flex: 1;

    display: flex;
    align-items: flex-start;
`

const SearchIcon = styled.div`
    margin-left: 0.8em;
    padding-bottom: 0.8em;
    cursor: pointer;

    & svg {
        width: 16px;
        height: 16px;
        top: 0;
    }
`

const InputBox = styled.input`
    flex: 1;

    min-width: 0;
    font-size: 1em;
`

const FiltersContainer = styled.div`
    margin-left: 0.5em;

    display: flex;
`

const FilterBox = styled.div`
    border: 1.5px solid ${(p) => p.theme.textColor};
    border-radius: 16px;
    padding: 0.5em 0.75em;
`

export default Search