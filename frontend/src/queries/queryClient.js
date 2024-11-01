import { QueryClient } from "@tanstack/react-query"

const retry = (count, err) => {
    if (400 <= err.response?.status && err.response?.status <= 451) {
        return false
    }

    return count < 3
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 1000,
            retry,
        },
    },
})

export default queryClient
