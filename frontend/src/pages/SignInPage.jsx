import { useState } from 'react'

import PageTitle from '@components/common/PageTitle'
import { signIn } from '@api/users.api'

const SignInPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const onSubmit = async e => {
        e.preventDefault()
        
        const result = await signIn(email, password)
        if (result) {
            setMessage("Signed in successfully")
        } else {
            setMessage("Sign in failed.")
        }
    }

    return <>
    <PageTitle>Sign in</PageTitle>
    <form onSubmit={onSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button>Sign in</button>
    </form>
    <p>
        {message}
    </p>
    </>
}

export default SignInPage