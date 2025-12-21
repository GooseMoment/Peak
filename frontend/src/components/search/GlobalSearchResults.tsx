import { useCallback, useMemo, useState } from "react"

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"
import { SearchResponse } from "@api/search.api"

type InfoKey = "project" | "drawer" | "task"
const sectionOrder: InfoKey[] = ["project", "drawer", "task"]

const GlobalSearchResults = ({ searchResults }: {searchResults: SearchResponse}) => {
    const totalCount = searchResults ? Object.values(searchResults).reduce(
        (sum, section) => sum + section.count,
        0
    ) : 0

    if(!searchResults?.project) return

    return (
        totalCount === 0 ? (
            "검색 결과가 없습니다."
        ):(
            <ResultsContainer>
                {sectionOrder.map((key) => {
                    const section = searchResults[key]
                    if (section.count === 0) return <ResultBlockBox key={key}/>
                    return (
                        section.data.map((value, index: number) => (
                            <ResultBox key={index}>
                                {key + ": " + value.name}
                            </ResultBox>
                        ))
                    )
                })}
            </ResultsContainer>
        )
    )
}

const ResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const ResultBlockBox = styled.div`
    display: flex;
    flex-direction: column;
`

const ResultBox = styled.div`
    display: flex;
    flex-direction: column;
`

export default GlobalSearchResults