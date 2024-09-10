import PageTitle from "@components/common/PageTitle"
import SearchBar from "@components/search/SearchBar"

const SearchPage = () => {
    return (
        <>
            <PageTitle>Search</PageTitle>
            <SearchBar handleSearch={console.log}/>

        </>
    )
}

export default SearchPage
