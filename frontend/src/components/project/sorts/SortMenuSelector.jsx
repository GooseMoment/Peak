import useScreenType from "@utils/useScreenType"

import SortMenuMobile from "./SortMenuMobile"
import SortMenu from "./SortMenu"

const SortMenuSelector = ({
    title,
    items,
    selectedButtonPosition = ()=>{},
    onClose = ()=>{},
    ordering,
    setOrdering
}) => {
    const { isMobile } = useScreenType()

    return isMobile ? 
        <SortMenuMobile
            title={title}
            items={items}
            onClose={onClose}
            ordering={ordering}
            setOrdering={setOrdering}/> 
        : <SortMenu
            title={title}
            items={items}
            selectedButtonPosition={selectedButtonPosition}
            ordering={ordering}
            setOrdering={setOrdering}/>
}

export default SortMenuSelector
