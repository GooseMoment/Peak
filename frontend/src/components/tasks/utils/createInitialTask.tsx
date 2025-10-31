import type { Drawer } from "@api/drawers.api"
import type { MinimalTask } from "@api/tasks.api"

const createInitialTask = (
    drawer: Drawer,
    converted_init_assigend_at?: string | null,
): MinimalTask => {
    return {
        name: "",
        drawer: drawer,
        privacy: null,
        priority: 0,
        completed_at: null,
        assigned_at: converted_init_assigend_at || null,
        due_type: null,
        due_date: null,
        due_datetime: null,
        reminders: [],
        memo: "",
    }
}

export default createInitialTask
