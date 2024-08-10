import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import { getPeck, postPeck } from "@api/social.api"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { toast } from "react-toastify"

const PeckButton = ({ taskID, isUncomplete }) => {
    const { data: peck, isError: peckError } = useQuery({
        queryKey: ["peck", taskID],
        queryFn: () => getPeck(taskID),
        enabled: !!taskID,
    })

    const peckMutation = useMutation({
        mutationFn: () => {
            return postPeck(taskID)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["peck", taskID] })
        },
        onError: (e) => {
            toast.error(e)
        },
    })

    const handlePeck = () => {
        if (isUncomplete) {
            peckMutation.mutate()
        }
    }

    const preprocess = (counts) => {
        if (counts > 99) return "99+"
        else if (counts === 0) return " "
        return counts
    }

    return (
        <Box>
            <PeckButtonBox onClick={handlePeck}>
                <FeatherIcon icon="send" />
            </PeckButtonBox>
            {peck && <PeckCounts>{preprocess(peck.pecks_counts)}</PeckCounts>}
        </Box>
    )
}

const Box = styled.div`
    height: 2em;
    width: 3.5em;

    display: flex;
    align-items: center;
    justify-content: center;
`

const PeckButtonBox = styled(MildButton)`
    height: 2em;

    display: flex;
    align-items: center;
    justify-content: center;

    & svg {
        top: unset;
        margin-right: unset;

        transform: rotate(45deg);
    }
`

const PeckCounts = styled.div`
    flex-grow: 1;

    text-align: center;
    font-size: 1em;
`

export default PeckButton
