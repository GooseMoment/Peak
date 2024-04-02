import { useState } from "react"
import { useLoaderData } from "react-router-dom"

import { patchUser } from "@api/users.api"

const UserPage = () => {
    const user = useLoaderData()
    const [bio, setBio] = useState(user.bio)

    const changeBio = async e => {
        const res = await patchUser({bio})
        if (res === 200) alert("OK")
    }

    // TODO: @andless2004 영서의 페이지

    return <>
        <h1>@{user.username}'s profile</h1>
        <ul>
            <img src={user.profile_img} />
            <li>display_name: {user.display_name}</li>
        </ul>
        <br/>
        <h1>Let's edit bio!</h1>
        <textarea value={bio} onChange={e => setBio(e.target.value)} />
        <button onClick={changeBio}>Change Bio</button>
    </>
}

export default UserPage