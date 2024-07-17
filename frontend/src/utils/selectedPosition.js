const handleIsContextMenuOpen = (setSelectedButtonPosition, setIsContextMenuOpen) => {
    return async (e) => {
        setSelectedButtonPosition({
            top: e.target.getBoundingClientRect().top,
            left: e.target.getBoundingClientRect().left,
        })
        setIsContextMenuOpen(prev => !prev)
    }
}

export default handleIsContextMenuOpen