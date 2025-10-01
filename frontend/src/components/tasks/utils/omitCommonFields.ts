type CommonRemovedFields =
    | "id"
    | "user"
    | "created_at"
    | "updated_at"
    | "deleted_at"

type WithCommonFields = {
    id?: unknown
    user?: unknown
    created_at?: unknown
    updated_at?: unknown
    deleted_at?: unknown
}

function omitCommonFields<T extends WithCommonFields>(
    data: T,
): Omit<T, CommonRemovedFields> {
    const {
        id: _id,
        user: _user,
        created_at: _created_at,
        updated_at: _updated_at,
        deleted_at: _deleted_at,
        ...rest
    } = data

    return rest
}

export default omitCommonFields
