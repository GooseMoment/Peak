import { useCallback, useMemo, useState } from "react"

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Search from "@components/search/Search"
import PageTitle from "@components/common/PageTitle"
import ErrorProjectList from "@components/errors/ErrorProjectList"
import ProjectName from "@components/project/ProjectName"
import ProjectEdit from "@components/project/edit/ProjectEdit"
import SkeletonProjectList from "@components/project/skeletons/SkeletonProjectList"

import { getSearchResults } from "@api/search.api"
import {
    type Project,
    getProjectList,
    patchReorderProject,
} from "@api/projects.api"

import HTML5toTouch from "@utils/html5ToTouch"
import { getPageFromURL } from "@utils/pagination"
import useModal, { Portal } from "@utils/useModal"
import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { ImpressionArea } from "@toss/impression-area"
import FeatherIcon from "feather-icons-react"
import { DndProvider } from "react-dnd-multi-backend"
import { useTranslation } from "react-i18next"

const SearchPage = () => {
    const { t } = useTranslation("translation")

    const modal = useModal()

    const {
        data,
        isPending,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["projects"],
        queryFn: (context) => getProjectList(context.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const projects = useMemo(() => {
        if (!data) return []
        return data.pages.flatMap((page) => page.results ?? []) || []
    }, [data])

    // Drag and drop state
    const [tempProjectOrder, setTempProjectOrder] = useState<Project[]>([])
    const displayProjects =
        tempProjectOrder.length > 0 ? tempProjectOrder : projects

    const { mutateAsync } = useMutation({
        mutationFn: (data: Partial<Project>[]) => {
            return patchReorderProject(data)
        },
    })

    const moveProject = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const updatedOrder = [...displayProjects]
            const [moved] = updatedOrder.splice(dragIndex, 1)
            updatedOrder.splice(hoverIndex, 0, moved)
            setTempProjectOrder(updatedOrder)
        },
        [displayProjects],
    )

    const dropProject = useCallback(async () => {
        const changedProjects = displayProjects
            .map((project, index) => ({ id: project.id, order: index }))
            .filter((project, index) => {
                const originalIndex = projects.findIndex(
                    (p) => p.id === project.id,
                )
                return originalIndex !== index
            })

        if (changedProjects.length === 0) return

        await mutateAsync(changedProjects)
        await queryClient.invalidateQueries({
            queryKey: ["projects"],
        })
        // Reset temp order after successful API update
        setTempProjectOrder([])
    }, [projects, displayProjects, mutateAsync])

    // Search
    const [searchQuery, setSearchQuery] = useState("")

    /*
    const {
        data: searchData,
        // isSearchPending,
        // isSearchError,
        // refetchSearch,
        // fetchSearchNextPage,
        // hasSearchNextPage,
        // isSearchFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["search", searchQuery],
        enabled: false,//
        // enabled: searchQuery.length > 0,    // TODO: searchQuery 타입에 따라 enable 조건이 변경되어야 함.
        queryFn: ({pageParam, queryKey}) => {
            const [, q] = queryKey
            return getSearchResults(q, pageParam)
        },
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })
*/
    const {
        data: searchData
    } = useQuery({
        queryKey: ["search", searchQuery],
        // enabled: false,
        enabled: searchQuery.length > 0,
        queryFn: ({queryKey}) => {
            const [, q] = queryKey
            return getSearchResults(q)
        }
    })

    // const searchResults = searchData?.pages.flatMap((page) => page.results) ?? [];
    const searchResults = searchData
    console.log(searchResults)

    return (
        <>
            <PageTitleBox>
                <PageTitle>{t("project_list.title")}</PageTitle>
                {isPending || (
                    <PlusBox
                        onClick={() => {
                            modal.openModal()
                        }}>
                        <FeatherIcon icon="plus" />
                    </PlusBox>
                )}
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            </PageTitleBox>

            {isPending && <SkeletonProjectList />}
            {isError && <ErrorProjectList refetch={() => refetch()} />}

            {/* Search 관련 부분 */}
            <SearchResultContainer>
            {/*
                {searchResults.map((project) =>
                    <SearchResultBox key={project.id}>
                        {project.name} + " " + {project.type}
                    </SearchResultBox>
                )}
            */}
                {searchResults && Object.entries(searchResults).map(([type, resultsArray]) => (
                    resultsArray && resultsArray.map((result) => 
                        <SearchResultBox key={result.id}>
                            {type + ": " + result.name}
                        </SearchResultBox>
                    )
                ))}
            </SearchResultContainer>
            {/* Search 관련 부분 끝 */}

            <DndProvider options={HTML5toTouch}>
                {displayProjects.map((project) => (
                    <ProjectName
                        key={project.id}
                        project={project}
                        moveProject={moveProject}
                        dropProject={dropProject}
                        isPending={isPending}
                    />
                ))}
            </DndProvider>

            <StyledImpressionArea
                onImpressionStart={() => {
                    if (hasNextPage) fetchNextPage()
                }}
                timeThreshold={200}>
                {isFetchingNextPage && t("common.loading")}
            </StyledImpressionArea>

            {isPending || (
                <ProjectCreateButton
                    onClick={() => {
                        modal.openModal()
                    }}>
                    <FeatherIcon icon="plus-circle" />
                    <ProjectCreateText>
                        {t("project_list.button_add_project")}
                    </ProjectCreateText>
                </ProjectCreateButton>
            )}
            <Portal modal={modal}>
                <ProjectEdit />
            </Portal>
        </>
    )
}

const PageTitleBox = styled.div`
    display: flex;
    align-items: center;
`

const PlusBox = styled.div`
    margin-left: 0.8em;
    padding-bottom: 0.8em;
    cursor: pointer;

    & svg {
        width: 16px;
        height: 16px;
        top: 0;
    }
`

const ProjectCreateButton = styled.div`
    display: flex;
    align-items: center;
    padding: 1em 0em;
    margin-left: 0.8em;
    cursor: pointer;

    & svg {
        width: 1.1em;
        height: 1.1em;
        top: 0;
    }

    ${ifMobile} {
        padding: 0.5em 0em;
        margin-left: 0em;
    }
`

const StyledImpressionArea = styled(ImpressionArea)`
    min-height: 24px;
    min-width: 1px;

    display: flex;
    align-items: center;
    justify-content: center;
`

const ProjectCreateText = styled.div`
    font-size: 1em;
    font-weight: medium;
    color: ${(p) => p.theme.textColor};
    margin-top: 0em;
`

const SearchResultContainer = styled.div`
    border: solid black;

    display: flex;
    flex-direction: column;
`

const SearchResultBox = styled.div`
`

export default SearchPage
