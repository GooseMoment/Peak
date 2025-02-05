import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"

import { deleteHeart, getHeart, postHeart } from "@api/announcements.api"

import FeatherIcon from "feather-icons-react"

const HeartButton = ({ announcement }) => {
    const client = useQueryClient()

    const { data: hearted, isFetching } = useQuery({
        queryFn: () => getHeart(announcement.id),
        queryKey: ["announcements", announcement.id, "hearted"],
    })

    const mutation = useMutation({
        mutationFn: () => {
            if (hearted) {
                return deleteHeart(announcement.id)
            }

            return postHeart(announcement.id)
        },
        onSuccess: () => {
            client.invalidateQueries(["announcements", announcement.id])
        },
    })

    return (
        <ButtonGroup $margin="1em 0" $justifyContent="right">
            <Button
                onClick={mutation.mutate}
                disabled={isFetching || mutation.isPending}
                loading={isFetching || mutation.isPending}>
                <HeartIcon icon="heart" $filled={hearted} />
                {announcement.hearts_count}
            </Button>
        </ButtonGroup>
    )
}

const HeartIcon = styled(FeatherIcon)`
    top: 0;

    & > g > path {
        fill: ${(p) => (p.$filled ? p.theme.goose : "transparent")};
    }
`

export default HeartButton
