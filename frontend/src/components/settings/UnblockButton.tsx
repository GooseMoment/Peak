import { useState } from "react"

import { useMutation } from "@tanstack/react-query"

import Button from "@components/common/Button"

import { deleteBlock, putBlock } from "@api/social.api"
import type { User } from "@api/users.api"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export default function UnblockButton({ user }: { user: User }) {
    const { t } = useTranslation("settings", { keyPrefix: "blocks" })

    const [blocked, setBlocked] = useState(true)

    const mutation = useMutation({
        mutationFn: ({ prev }: { prev: boolean }) => {
            if (prev) {
                // if blocked
                return deleteBlock(user.username)
            } else {
                return putBlock(user.username)
            }
        },
        onSuccess: () => {
            setBlocked(!blocked)
        },
        onError: () => {
            toast.error(t("blockees.error"))
        },
    })

    return (
        <Button
            loading={mutation.isPending}
            disabled={mutation.isPending}
            onClick={() => mutation.mutate({ prev: blocked })}>
            {blocked
                ? t("blockees.button_unblock")
                : t("blockees.button_block")}
        </Button>
    )
}
