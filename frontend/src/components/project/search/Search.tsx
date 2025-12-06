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
    const handleExecuteSearch = () => {
        const trimmed = searchQuery.trim()

        const now = Date.now()

        // 최근 300ms 내에 같은 쿼리로 서칭되면 무시 (중복 방지)
        if (
            lastSearchRef.current &&
            lastSearchRef.current.q === trimmed &&
            now - lastSearchRef.current.ts < 300
        ) {
            return
        }

        lastSearchRef.current = { q: trimmed, ts: now }

        console.log(trimmed)
        setSearchQuery(trimmed)
    }

    // 입력창 시작
    const handleClick = () => {
        inputRef.current?.focus()
    }

    // 입력창 처리
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("value: ", e.target.value)
        setSearchQuery(e.target.value)

        
        if (debounceTimerRef.current !== null) {
            window.clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = window.setTimeout(() => {
            console.log("debounce: ", searchQuery)
            handleExecuteSearch()
        }, 1500)
    }

    // 입력창 끝
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {            
            handleExecuteSearch()
        }
    }

    const handleBlur = () => {
        handleExecuteSearch()
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