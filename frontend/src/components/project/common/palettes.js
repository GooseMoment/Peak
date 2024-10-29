export const palettes = {
    theme1: [
        "orange",
        "peach",
        "pink",
        "dark_yellow",
        "yellow",
        "light_green",
        "turquoise",
        "dark_blue",
    ],
    theme2: [
        "red",
        "brown",
        "green",
        "sky_blue",
        "light_purple",
        "purple_blue",
        "blue",
        "purple",
    ],
}

const light = {
    grey: "#CCCCCC",
    orange: "#F05A29",
    peach: "#F7786B",
    pink: "#FD99E1",
    dark_yellow: "#F7A043",
    yellow: "#F6CB52",
    light_green: "#7DF1AF",
    turquoise: "#76C8B1",
    dark_blue: "#0E4A84",
    red: "#E22B30",
    brown: "#90472A",
    green: "#B5DF50",
    sky_blue: "#8CD7FF",
    light_purple: "#C2A0FF",
    purple_blue: "#4B44CF",
    blue: "#2743D2",
    purple: "#5E35B1",
}

const dark = {
    grey: "#858585",
    orange: "#EB5321",
    peach: "#F8857A",
    pink: "#FB90C5",
    dark_yellow: "#F49D3F",
    yellow: "#F3B816",
    light_green: "#8DF9BC",
    turquoise: "#50B99B",
    dark_blue: "#15528C",
    red: "#E64B4F",
    brown: "#B15835",
    green: "#C0E46A",
    sky_blue: "#70BDE7",
    light_purple: "#CCB7F3",
    purple_blue: "#6660D6",
    blue: "#475FD8",
    purple: "#6E49B9",
}

const themes = {
    light: light,
    dark: dark,
}

export const getProjectColor = (theme, color) => {
    return themes[theme][color]
}
