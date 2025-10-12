import styled from "styled-components"

import LoaderCircle from "@components/common/LoaderCircle"

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

export const Title = styled.h2`
    font-weight: bold;
    font-size: 2rem;
`

export const Content = styled.div`
    display: flex;
    flex-direction: column;

    gap: 1rem;
`

export const Text = styled.p`
    line-height: 1.3;
    margin-top: 1em;
    margin-bottom: 1em;
`

export const VerifiedMessage = styled.p`
    margin-bottom: 3em;
    font-weight: 500;
`

export const Links = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75em;
`

export const LinkText = styled.p`
    font-size: 1em;
    font-weight: 500;

    text-align: center;
    line-height: 1.25;
`

export const TosAgreement = styled.p`
    text-align: center;
    font-size: 0.75em !important;
    color: ${(p) => p.theme.grey};

    & a {
        display: inline-block;
        text-decoration: underline;
    }
`

export const FullLoader = styled(LoaderCircle)`
    width: 3em;
    color: inherit;
    opacity: 0.7;

    border-width: 0.35em;
`
