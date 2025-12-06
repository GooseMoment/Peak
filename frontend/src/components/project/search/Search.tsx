import { ChangeEvent, useEffect, useRef, useState } from "react"

import styled, { useTheme } from "styled-components"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("")

    const inputRef = useRef<HTMLInputElement>(null)
    const debounceTimerRef = useRef<number | null>(null)
    const lastSearchRef = useRef<{ q: string; ts: number } | null>(null)

    // temporary stub
    const handleExecuteSearch = (query: string) => {
        const now = Date.now()

        // 최근 같은 쿼리로 서칭되면 무시 (중복 방지)
        // TODO: ref 대신 실 search 천에 퀴리만 이전과 비교하며, 같은 쿼리에 새로운 결과를 얻고 싶어하는 경우를 고려할 것.
        if (
            lastSearchRef.current &&
            lastSearchRef.current.q === query
        ) {
            return
        }
        lastSearchRef.current = { q: query, ts: now }

        console.log(query)
        setSearchQuery(query)
    }

    // Start get input process
    const handleClick = () => {
        inputRef.current?.focus()
    }

    // Edit input process
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const trimmed = e.target.value.trim()
        setSearchQuery(trimmed)

        // Debounce
        if (debounceTimerRef.current !== null) {
            window.clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = window.setTimeout(() => {
            handleExecuteSearch(trimmed)
        }, 1500)
    }

    // End and search
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            const trimed = searchQuery.trim()
            handleExecuteSearch(trimed)
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const trimed = e.target.value.trim()
        handleExecuteSearch(trimed)
    }

    return (
        <SearchWrapper>
            <SearchIcon>
                <FeatherIcon
                    icon="search"
                    onClick={handleClick}
                />
            </SearchIcon>

            {
                <InputBox
                    ref={inputRef}
                    type="text"
                    placeholder="할 일을 검색해 보세요"
                    value={searchQuery}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                />
            }
        </SearchWrapper>
    )
}

const SearchWrapper = styled.div`
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

export default Search