import styled from "styled-components"

import { ButtonGroup } from "@components/common/Button"
import CommentButton from "@components/social/interaction/comment/CommentButton"
import PeckButton from "@components/social/interaction/peck/PeckButton"
import ReactionContainer from "@components/social/interaction/reactions/ReactionContainer"

// TODO: replace Task
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InteractionContainer({ task }: { task: any }) {
    return (
        <Box>
            <ReactionContainer task={task} />
            <ButtonGroup $justifyContent="flex-end" $margin="0 0 0 0.25em">
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
