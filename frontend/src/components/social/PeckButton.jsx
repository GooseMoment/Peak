import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import MildButton from "@components/common/MildButton"

import { getPeck, postPeck } from "@api/social.api"

const PeckButton = ({taskID}) => {
    const { data: peck, isError: peckError } = useQuery({
        queryKey: ['peck', taskID],
        queryFn: () => getPeck(taskID),
        enabled: !!taskID
    })

    const peckMutation = useMutation({
        mutationFn: () => {
            return postPeck(taskID)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['peck', taskID]})
        },
        onError: (e) => {
            toast.error(e)
        }
    })

    const preprocess = (counts) => {
        if(counts > 99) return '99+'
        return counts
    }

    return <PeckBox>
        <PeckButtonBox>
            <FeatherIcon icon="send"/>
        </PeckButtonBox>
        {(peck && peck.pecks_counts != 0) && <PeckCounts>{preprocess(peck.pecks_counts)}</PeckCounts>}
    </PeckBox>
}

const PeckBox = styled.div`
    height: 2em;
    width: 3.5em;

    display: flex;
    align-items: center;
    justify-content: center;
`

const PeckButtonBox = styled(MildButton)`
    margin-left: 0.4em;
    height: 2em;

    display: flex;
    align-items: center;
    justify-content: center;

    & svg {
        top: unset;
        margin-right: unset;
    }
`

const PeckCounts = styled.div`
    flex-grow: 1;
    margin-right: 0.1em;

    text-align: center;
    font-size: 1em;
`

export default PeckButton