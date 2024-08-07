import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

const ErrorProjectList = () => {
    return (
        <ErrorBox>
            <FeatherIcon icon="alert-triangle" />
            프로젝트 리스트를 불러오지 못했습니다 😢
        </ErrorBox>
    )
}

const ErrorBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3em;
    margin: 1.5em 0em;
    border-radius: 15px;
    font-size: 1.3em;
    color: ${(p) => p.theme.white};
    background-color: ${(p) => p.theme.primaryColors.danger};
    cursor: pointer;
`

export default ErrorProjectList
