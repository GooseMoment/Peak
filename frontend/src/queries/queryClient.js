import { QueryClient } from "@tanstack/react-query"

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import {
    persistQueryClient,
    removeOldestQuery,
} from "@tanstack/react-query-persist-client"

const retry = (count, err) => {
    if (400 <= err.response?.status && err.response?.status <= 451) {
        return false
    }

    return count < 3
}

const seconds = (sec) => sec * 1000
const minutes = (min) => min * seconds(60)
const hours = (hour) => hour * minutes(60)

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: seconds(5),
            gcTime: hours(24),
            retry,
        },
    },
})

const localStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage,
    retry: removeOldestQuery,
})

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
})

export default queryClient
