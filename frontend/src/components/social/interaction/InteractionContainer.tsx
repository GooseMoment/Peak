import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import { ButtonGroup } from "@components/common/Button"
import CommentButton from "@components/social/interaction/comment/CommentButton"
import PeckButton from "@components/social/interaction/peck/PeckButton"
import EmojiPickerButton, {
    PickerButtonSkeleton,
} from "@components/social/interaction/reaction/EmojiPickerButton"
import ReactionButton from "@components/social/interaction/reaction/ReactionButton"

import { Emoji, getTaskReactions } from "@api/social.api"
import type { User } from "@api/users.api"

interface GroupedEmoji {
    imageEmoji: Emoji | null
    unicodeEmoji: string | null
    count: number
    users: User[]
}

// TODO: replace Task
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InteractionContainer({ task }: { task: any }) {
    const {
        data: reactions,
        isSuccess,
        isPending,
    } = useQuery({
        queryKey: ["tasks", task.id, "reactions"],
        queryFn() {
            return getTaskReactions(task.id)
        },
        select(data) {
            const reduced: GroupedEmoji[] = []

            for (let i = 0; i < data.length; i++) {
                if (
                    i === 0 ||
                    data[i - 1].unicode_emoji !== data[i].unicode_emoji ||
                    data[i - 1].image_emoji?.name !== data[i].image_emoji?.name
                ) {
                    reduced.push({
                        imageEmoji: data[i].image_emoji,
                        unicodeEmoji: data[i].unicode_emoji,
                        count: 0,
                        users: [],
                    })
                }

                reduced[reduced.length - 1].count += 1
                reduced[reduced.length - 1].users.push(data[i].user)
            }

            return reduced
        },
    })

    return (
        <Box>
            <ReactionContainer>
                {isSuccess &&
                    reactions.map((val) => (
                        <ReactionButton
                            key={val.unicodeEmoji || val.imageEmoji?.name}
                            unicodeEmoji={val.unicodeEmoji}
                            imageEmoji={val.imageEmoji}
                            users={val.users}
                            count={val.count}
                        />
                    ))}
                {isSuccess && !!task.completed_at && (
                    <EmojiPickerButton onSelectEmoji={() => {}} />
                )}
                {isPending && <PickerButtonSkeleton />}
            </ReactionContainer>
            <ButtonGroup $justifyContent="flex-start" $margin="0 0 0 0.25em">
                <CommentButton parentType="task" parent={task} />
                <PeckButton
                    taskID={task.id}
                    isUncomplete={!task.completed_at}
                />
            </ButtonGroup>
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const ReactionContainer = styled.div`
    margin-left: auto;
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
`
