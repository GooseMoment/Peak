import { Fragment, useState } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import { SkeletonProjectPage } from "@components/project/skeletons/SkeletonProjectPage"
import RemarkContainer from "@components/social/RemarkContainer"
import FollowButton from "@components/users/FollowButton"

import TaskBox from "./TaskBox"

import { getDailyLogDetails } from "@api/social.api"

import { useClientTimezone } from "@utils/clientSettings"
import { getCursorFromURL } from "@utils/pagination"

import { getPaletteColor } from "@assets/palettes"

import { ImpressionArea } from "@toss/impression-area"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const LogDetails = ({ pageType = "following", username, selectedDate }) => {
    const { t } = useTranslation("", { keyPrefix: "social.log_details" })
    const theme = useTheme()
    const tz = useClientTimezone()

    const date = DateTime.fromISO(selectedDate).setZone(tz)

    // logDetails
    const {
        data: logDetailsPage,
        fetchNextPage: fetchNextLogDetailsPage,
        isPending: isLogDetailsPending,
    } = useInfiniteQuery({
        queryKey: ["daily", "log", "details", username, selectedDate],
        queryFn: (page) =>
            getDailyLogDetails(username, selectedDate, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        // enabled: pageType === "following",   // 나중에 백엔드에서 Explore 용 view 따로 만들고 enabled 조건 추가
    })

    const isLogDetailsEmpty = logDetailsPage?.pages[0]?.results?.length === 0

    // TODO: Drawer 접기
    const [hiddenDrawers] = useState(new Set())

    if (isLogDetailsPending) {
        return <SkeletonProjectPage />
    }

    return (
        <DetailBox>
            <RemarkWrapper>
                <RemarkContainer username={username} date={date} />
                {pageType === "explore" && <FollowButton user={{ username }} />}
            </RemarkWrapper>

            {/* TODO: When there are no task */}
            <DetailBody>
                {isLogDetailsEmpty && <NoContent>{t("no_content")}</NoContent>}

                {logDetailsPage?.pages.map((group) =>
                    group.results.map((task, index, array) => {
                        const color = getPaletteColor(
                            theme.type,
                            task.project_color,
                        )
                        return (
                            <Fragment key={task.id}>
                                {(index === 0 ||
                                    array[index - 1].drawer !==
                                        task.drawer) && (
                                    <DrawerBox $color={color}>
                                        <DrawerName $color={color}>
                                            {" "}
                                            {task.drawer_name}{" "}
                                        </DrawerName>
                                    </DrawerBox>
                                )}

                                {!hiddenDrawers.has(task.drawer) && (
                                    <TaskBox
                                        task={task}
                                        color={color}
                                        isFollowingPage={
                                            pageType === "following"
                                        }
                                    />
                                )}
                            </Fragment>
                        )
                    }),
                )}

                <ImpressionArea
                    onImpressionStart={() => fetchNextLogDetailsPage()}
                    timeThreshold={200}
                />
            </DetailBody>
        </DetailBox>
    )
}

const DetailBox = styled.div`
    display: flex;
    flex-direction: column;
`

const RemarkWrapper = styled.div`
    margin-top: 1em;
    padding: 0.25em;

    display: flex;
    flex-direction: column;
    gap: 0.7em;
`

const DetailBody = styled.div`
    max-height: 70%;
    overflow-y: auto;

    // IE and Edge
    -ms-overflow-style: none;
    // Firefox
    scrollbar-width: none;
    // Chrome, Safari, Opera
    &::-webkit-scrollbar {
        display: none;
    }
`

const NoContent = styled.div`
    margin: 2em;

    display: flex;
    align-items: center;
    justify-content: center;
`

export default LogDetails
