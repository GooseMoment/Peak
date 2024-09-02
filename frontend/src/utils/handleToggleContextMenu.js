const handleToggleContextMenu = (
    setSelectedButtonPosition,
    setIsMenuOpen,
    setCloseOtherModals=()=>{},
) => {
    return async (e) => {
        setSelectedButtonPosition({
            top: e.target.getBoundingClientRect().top,
            left: e.target.getBoundingClientRect().left,
        })
        setIsMenuOpen((prev) => !prev)
        setCloseOtherModals(false)
    }
}

export default handleToggleContextMenu
