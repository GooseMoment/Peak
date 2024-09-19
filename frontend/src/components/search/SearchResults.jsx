import styled from "styled-components"

import TaskFrame from "@components/tasks/TaskFrame"

const SearchResults = ({ searchResults }) => {
    return (
        <Wrapper>
            {searchResults?.map((task) => (
                <TaskFrame key={task.id} task={task} />
            ))}
        </Wrapper>
    )
}

const Wrapper = styled.div``

export default SearchResults
