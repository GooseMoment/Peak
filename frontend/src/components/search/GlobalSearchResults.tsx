import { useCallback, useMemo, useState } from "react"

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"
import { SearchResponse } from "@api/search.api"
import { ProjectResultBox, DrawerResultBox, TaskResultBox } from "@components/search/ResultBox"

const GlobalSearchResults = ({ searchResults }: {searchResults: SearchResponse}) => {
    const totalCount = searchResults ? Object.values(searchResults).reduce(
        (sum, section) => sum + section.count,
        0
    ) : 0

    if(!searchResults?.project) return

    const projectSection = searchResults["project"]
    const drawerSection = searchResults["drawer"]
    const taskSection = searchResults["task"]

    return (
        totalCount === 0 ? (
            "검색 결과가 없습니다."
        ):(
            <ResultsContainer>
                <SectionContainer>
                    {projectSection?.data.map((project, index: number) => (
                        <ProjectResultBox key={index} project={project} />
                    ))}
                </SectionContainer>

                <SectionContainer>
                    {drawerSection?.data.map((drawer, index: number) => (
                        <DrawerResultBox key={index} drawer={drawer} />
                    ))}
                </SectionContainer>

                <SectionContainer>
                    {taskSection?.data.map((task, index: number) => (
                        <TaskResultBox key={index} task={task} />
                    ))}
                </SectionContainer>
            </ResultsContainer>
        )
    )
}

const ResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const SectionContainer = styled.div`
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