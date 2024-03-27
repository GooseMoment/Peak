import { useNavigate } from 'react-router-dom'

import { isSignedIn } from '@api/users.api'
import { useEffect } from 'react'

const AuthGuard = ({children}) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (isSignedIn()) {
            navigate("/")
        }
    }, [])

    return children
}

export default AuthGuard