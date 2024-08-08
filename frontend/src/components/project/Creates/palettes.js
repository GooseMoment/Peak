export const palettes = {
    "basic": [
        {color: "orange", display: "오렌지"},
        {color: "peach", display: "피치"},
        {color: "pink", display: "핑크"},
        {color: "dark_yellow", display: "진노랑"},
        {color: "yellow", display: "노랑"},
        {color: "green", display: "연두"},
        {color: "turquoise", display: "청록"},
        {color: "dark_blue", display: "남색"},
    ]
}

const displayColor = {
    orange: "오렌지",
    peach: "피치",
    pink: "핑크",
    dark_yellow: "진노랑",
    yellow: "노랑",
    green: "연두",
    turquoise: "청록",
    dark_blue: "남색",
}

const light = {
    orange: "#F05A29",
    peach: "#F7786B",
    pink: "#FD99E1",
    dark_yellow: "#F7A043",
    yellow: "#F6CB52",
    green: "#7DF1AF",
    turquoise: "#76C8B1",
    dark_blue: "#50B99B",
}

const dark = {
    orange: "#EB5321",
    peach: "#F8857A",
    pink: "#FB90C5",
    dark_yellow: "#F49D3F",
    yellow: "#F3B816",
    green: "#8DF9BC",
    turquoise: "#50B99B",
    dark_blue: "#52A1A3",
}

const themes = {
    "light": light,
    "dark": dark,
}

export const getProjectColor = (theme, color) => {
    return themes[theme][color]
}

export const getColorDisplay = (color) => {
    return displayColor[color]
}
