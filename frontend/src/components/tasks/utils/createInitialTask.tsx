import type { Drawer } from "@api/drawers.api"

const createInitialTask = (drawer: Drawer) => {
    return {
        name: "",
        drawer: drawer,
        privacy: "public" as const,
        priority: 0,
        completed_at: null,
        assigned_at: null,
        due_type: null,
        due_date: null,
        due_datetime: null,
        reminders: [],
        memo: "",
    }
}

export default createInitialTask
