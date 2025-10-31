import type { Dispatch, SetStateAction } from "react"
import { Link } from "react-router-dom"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import styled, { css } from "styled-components"

import ErrorBox from "@components/errors/ErrorBox"
import LoadMoreButton from "@components/social/common/LoadMoreButton"

import { getCurrentUsername } from "@api/client"
import { type Stat, getStat, getStats } from "@api/social.api"
import type { User } from "@api/users.api"

import { getPageFromURL } from "@utils/pagination"
import useScreenType, { ifTablet } from "@utils/useScreenType"

import { usePastelPaletteColor } from "@assets/palettes"
import { skeletonBreathingCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"
import type { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

export default function StatContainer({
    date,
    selectedUser,
    setSelectedUser,
}: {
    date: DateTime
    selectedUser?: User["username"]
    setSelectedUser?: Dispatch<SetStateAction<User["username"]>>
}) {
    const me = getCurrentUsername()
    const { t } = useTranslation("translation")

    const myStatQuery = useQuery({
        queryKey: ["stats", me, date.toISODate()],
        queryFn: () => getStat(me!, date.toISODate()!),
    })

    const {
        data,
        isPending,
        isError,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["stats", date.toISODate()],
        queryFn: (page) => getStats(date.toISODate()!, page.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    if (isPending) {
        return (
            <Container>
                <StatBoxSkeleton mine key="mine" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <StatBoxSkeleton key={i} />
                ))}
            </Container>
        )
    }

    if (isError) {
        return <ErrorBox onRetry={refetch} />
    }

    return (
        <Container>
            {myStatQuery.isPending && <StatBoxSkeleton mine key="mine" />}
            {myStatQuery.isSuccess && (
                <StatBox
                    mine
                    stat={myStatQuery.data}
                    isSelected={myStatQuery.data.username === selectedUser}
                    setSelectedUser={setSelectedUser}
                />
            )}
            {data.pages.map((page) =>
                page.results.map((stat) => (
                    <StatBox
                        key={stat.username}
                        stat={stat}
                        isSelected={stat.username === selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                )),
            )}
            {isFetchingNextPage &&
                Array.from({ length: 2 }).map((_, i) => (
                    <StatBoxSkeleton key={i} />
                ))}
            {hasNextPage && (
                <LoadMoreButton
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                    disabled={isFetchingNextPage}>
                    <FeatherIcon icon="chevrons-down" />
                    <p>{t("common.load_more")}</p>
                    <FeatherIcon icon="chevrons-down" />
                </LoadMoreButton>
            )}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    max-width: 25rem;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 1em;
`

export function StatBoxSkeleton({ mine }: { mine?: boolean }) {
    return (
        <Box $mine={mine} $skeleton $isSelected={false} to="#">
            <ProfileImgWrapper>
                <ProfileImgSkeleton />
            </ProfileImgWrapper>
            <InfoContainer>
                <Username $skeleton />
                <SimpleStats>
                    <StatsUnit key="task">
                        <SkeletonStatusIconWrapper />
                        <StatusCount $skeleton />
                    </StatsUnit>
                    <StatsUnit key="reaction">
                        <SkeletonStatusIconWrapper />
                        <StatusCount $skeleton />
                    </StatsUnit>
                </SimpleStats>
            </InfoContainer>
        </Box>
    )
}

export function StatBox({
    stat,
    isSelected = false,
    setSelectedUser,
    mine,
    from = "following",
    demo = false,
}: {
    stat: Stat
    isSelected?: boolean
    setSelectedUser?: (
        username: string,
    ) => void | Dispatch<SetStateAction<User["username"]>>
    mine?: boolean
    from?: string
    demo?: boolean
}) {
    const { isDesktop } = useScreenType()
    const color = usePastelPaletteColor(stat.header_color)

    return (
        <Box
            $mine={mine}
            $isSelected={isSelected}
            $borderColor={color}
            to={`/app/social/daily/@${stat.username}/${stat.date}?from=${from}`}
            draggable={false}
            onClick={(e) => {
                if (setSelectedUser && (demo || isDesktop)) {
                    e.preventDefault()
                    setSelectedUser(stat.username)
                }
            }}>
            <ProfileImgWrapper>
                <ProfileImg
                    draggable={false}
                    src={stat.profile_img}
                    alt={stat.username}
                />
            </ProfileImgWrapper>
            <InfoContainer>
                <Username>@{stat.username}</Username>
                <SimpleStats>
                    <StatsUnit key="task">
                        <StatusIconWrapper $type="task">
                            <FeatherIcon icon="check" />
                        </StatusIconWrapper>
                        <StatusCount>{stat.completed_task_count}</StatusCount>
                    </StatsUnit>
                    <StatsUnit key="reaction">
                        <StatusIconWrapper $type="reaction">
                            <FeatherIcon icon="heart" />
                        </StatusIconWrapper>
                        <StatusCount>{stat.reaction_count}</StatusCount>
                    </StatsUnit>
                </SimpleStats>
            </InfoContainer>
        </Box>
    )
}

const Box = styled(Link)<{
    $mine?: boolean
    $isSelected: boolean
    $borderColor?: string
    $skeleton?: boolean
}>`
    box-sizing: border-box;
    width: calc(50% - 0.5em);
    aspect-ratio: 1/1;
    padding: 6%;
    color: ${(p) => p.theme.textColor};

    ${(props) =>
        props.$mine &&
        css`
            width: 100%;
            aspect-ratio: 2/1;
        `}

    background-color: ${(p) => p.theme.secondBackgroundColor};
    border-radius: 24px;
    box-shadow: ${(p) => p.theme.notifications.boxShadowColor} 0px 8px 24px;
    border: 3px transparent solid;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.75em;

    cursor: pointer;
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease;

    ${ifTablet} {
        padding: 1.5em !important;
    }

    @media (hover: hover) {
        &:hover {
            border-color: ${(p) => p.$borderColor};
        }
    }

    ${(p) =>
        p.$isSelected &&
        css`
            border-color: ${p.$borderColor};
            background-color: ${p.theme.backgroundColor};
        `}
`

const ProfileImgWrapper = styled.div`
    position: relative;
    aspect-ratio: 1;
    max-width: 4.5em;
    border-radius: 50%;

    ${ifTablet} {
        max-width: 64px !important;
    }
`

const ProfileImg = styled.img`
    aspect-ratio: 1;
    width: 100%;
    border-radius: 50%;
`

const ProfileImgSkeleton = styled.div`
    aspect-ratio: 1;
    width: 100%;
    border-radius: 50%;

    ${skeletonBreathingCSS}
`

const InfoContainer = styled.div`
    flex-grow: 1;
    max-height: 3em;

    display: flex;
    flex-direction: column;
    gap: 0.25em;
`

const Username = styled.div<{ $skeleton?: boolean }>`
    font-weight: 600;
    overflow-x: clip;
    text-overflow: ellipsis;

    text-align: left;
    white-space: nowrap;

    ${(props) =>
        props.$skeleton &&
        css`
            width: 100%;
            height: 1.15em;
            border-radius: 0.3em;
            ${skeletonBreathingCSS}
        `}
`

const SimpleStats = styled.div`
    height: 1.5em;

    display: flex;
    flex-direction: row;
    gap: 1em;
`

const StatsUnit = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.3em;
`

const StatusIconWrapper = styled.div<{ $type: "task" | "reaction" }>`
    box-sizing: border-box;
    aspect-ratio: 1;
    height: 18px;
    padding: 0;

    ${(props) =>
        props.$type === "task" &&
        css`
            border: 2px solid ${(p) => p.theme.textColor};
            border-radius: 50%;
        `}

    display: flex;
    justify-content: center;
    align-items: center;

    & svg {
        top: 0;
        width: 100%;
        height: 100%;
        margin: 0;

        stroke: ${(p) => p.theme.textColor};
        stroke-width: 3px;
        ${(props) =>
            props.$type === "reaction" &&
            css`
                fill: ${(p) => p.theme.textColor};
            `}
    }
`

const SkeletonStatusIconWrapper = styled.div`
    box-sizing: border-box;
    aspect-ratio: 1;
    height: 18px;
    padding: 0;

    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;

    ${skeletonBreathingCSS}
`

const StatusCount = styled.div<{ $skeleton?: boolean }>`
    overflow-x: clip;
    text-overflow: ellipsis;

    ${(p) =>
        p.$skeleton &&
        css`
            width: 1em;
            height: 1.2em;
            border-radius: 0.3em;
            ${skeletonBreathingCSS}
        `}
`
