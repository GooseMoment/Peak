import client from "@api/client"
import type { Base } from "@api/common"

export interface UserSetting extends Base {
    follow_request_approval_manually: boolean
    follow_request_approval_for_followings: boolean
    follow_list_privacy: "public" | "protected" | "private"
}

export const getSettings = async () => {
    const res = await client.get<UserSetting>(`users/me/setting/`)
    return res.data
}

export const patchSettings = async (data: Partial<UserSetting>) => {
    const res = await client.patch<UserSetting>(`users/me/setting/`, data)
    return res.data
}
