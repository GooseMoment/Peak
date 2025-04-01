import client, { getCurrentUsername, setCurrentUsername } from "@api/client"

import { type PaletteColorName } from "@assets/palettes"

export interface User {
    username: string
    display_name: string
    followings_count: number
    followers_count: number
    profile_img: string
    bio: string
    email: string
    header_color: PaletteColorName
    is_me: boolean
}

export const getMe = async () => {
    const res = await client.get<User>("users/me/")
    setCurrentUsername(res.data.username)
    return res.data
}

export const getUserByUsername = async (username: User["username"]) => {
    const res = await client.get<User>(`users/@${username}/`)
    return res.data
}

export const patchUser = async (data: Partial<User>) => {
    const username = getCurrentUsername()
    const res = await client.patch<User>(`users/@${username}/`, data)
    return res.status
}

export const patchPassword = async (
    current_password: string,
    new_password: string,
) => {
    await client.patch("users/me/password/", {
        current_password,
        new_password,
    })
}

export const uploadProfileImg = async (formData: FormData) => {
    const res = await client.post("users/me/profile_img/", formData)
    return res.status
}

export const getBlocks = async (page: number) => {
    const username = getCurrentUsername()
    const res = await client.get<User[]>(`users/@${username}/blocks/`, {
        params: { page },
    })
    return res.data
}
