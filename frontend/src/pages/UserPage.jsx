import { useState } from "react"
import { Form, useLoaderData, useRevalidator, useSubmit } from "react-router-dom"

const UserPage = () => {
    const user = useLoaderData()
    const submit = useSubmit()
    const [profile_img_uri, setProfile_img_uri] = useState(user.profile_img_uri)
    const revalidator = useRevalidator()

    // TODO: @andless2004 영서의 페이지

    return <>
        <h1>@{user.username}'s profile</h1>
        <ul>
            <img src={user.profile_img_uri} />
            <li>display_name: {user.display_name}</li>
            <li>bio: {user.bio}</li>
        </ul>
        <br/>
        {/* action을 발동시키기 위해서는 */}
        {/* 방법 1. React Router에서 제공하는 Form 사용 (html 기존 form의 대체제) */}
        <Form method="patch">
            <label>display_name</label>
            <input name="display_name" type="text" defaultValue={user.display_name} />
            <label>bio</label>
            <textarea name="bio" defaultValue={user.bio} />
            <button type="submit">Patch with Form</button>
        </Form>
        {/* 방법 2. React Router에서 제공하는 useSubmit 사용 */}
        <label>profile_img_uri</label>
        <input type="url" value={profile_img_uri} onChange={e => setProfile_img_uri(e.target.value)} />
        <button onClick={() => submit({profile_img_uri}, {method: "PATCH"})}>Patch with useSubmit</button>

        {/* 번외. useRevalidate */}
        {revalidator.state === "loading" ? <p>유저 정보 불러오는 중!!</p> : null}
        <button onClick={() => revalidator.revalidate()}>유저 정보 다시 로드</button>
    </>
}

export default UserPage