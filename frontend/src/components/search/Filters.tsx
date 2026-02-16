import { useMemo } from "react"

import styled from "styled-components"

import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import FilterBox from "@components/search/FilterBox"

export type FilterValues = {
    project: string
    drawer: string
    date: string
}
export type FilterLabel = keyof FilterValues

type FilterType = "text" | "tags" | "select" | "date"
type Filter = {
    label: FilterLabel
    display: string
    type: FilterType
}

interface FilterProps {
    filterValues: FilterValues
    setFilterValues: React.Dispatch<React.SetStateAction<FilterValues>>
}

const Filters = ({ filterValues, setFilterValues }: FilterProps) => {
    const { t } = useTranslation("translation", { keyPrefix: "search.filter"})

    const filterItems = useMemo(() => getFilterItems(t), [t])

    const setFilterValue = <K extends FilterLabel>(label: K) =>
        (value: FilterValues[K]) => {
            setFilterValues((prev) => {
                if (prev[label] === value) return prev
                console.log(label + ": " + value)
                return { ...prev, [label]: value,}
            })
        }

    return (
        <FiltersContainer>
            {filterItems.map((filterItem) => {
                return (
                    <FilterBox
                        key={filterItem.label}
                        filterDisplay={filterItem.display}
                        filterValue={filterValues[filterItem.label]}
                        setFilterValue={setFilterValue(filterItem.label)}
                    />
                )
            })}
        </FiltersContainer>
    )
}

const getFilterItems = (t: TFunction<"translation", "search.filter">) => [
        {
            label: "project",
            display: t("project"),
            type: "text",
        },
        {
            label: "drawer",
            display: t("drawer"),
            type: "text"
        },
        {
            label: "date",
            display: t("date"),
            type: "date"
        },
    ] as Filter[]


const FiltersContainer = styled.div`
    margin-left: 0.5em;

    display: flex;
    gap: 0.25em;
`

export default Filters