import PageTitle from "@components/common/PageTitle"
import Button, { ButtonGroup, buttonForms } from "@components/common/Button"
import Input from "@components/sign/Input"

import Loading from "@components/settings/Loading"
import Error from "@components/settings/Error"
import Section, { Name, Value, Sync } from "@components/settings/Section"
import ProfileImg from "@components/settings/ProfileImg"
import PasswordSection from "@components/settings/PasswordSection"

import { getMe, patchUser } from "@api/users.api"
import { states } from "@assets/themes"

import styled from "styled-components"

import queryClient from "@queries/queryClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

import { useTranslation } from "react-i18next"

const Account = () => {
    const { t } = useTranslation("", {keyPrefix: "settings.account"})

    const {data: user, isPending, isError} = useQuery({
        queryKey: ["users", "me"],
        queryFn: () => getMe(),
    })

    const mutation = useMutation({
        mutationFn: (data) => {
            return patchUser(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users", "me"]})
            toast.success(t("account_edited"))
        },
        onError: () => {
            toast.error(t("account_fail"))
        },
    })

    const onSubmit = e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        mutation.mutate(formData)
    }

    if (isPending) {
        return <Loading />
    }

    if (isError) {
        return <Error />
    }

    return <>
        <PageTitle>{t("title")} <Sync /></PageTitle>
        <Section>
            <ImgNameEmailContainer>
                <ProfileImg profile_img={user.profile_img} />
                <NameEmail>
                    <Username>@{user.username}</Username>
                    <Email>{user.email}</Email>
                </NameEmail>
            </ImgNameEmailContainer>
        </Section>
        <form onSubmit={onSubmit}>
            <Section>
                <Name>{t("display_name")}</Name>
                <Value>
                    <Input name="display_name" type="text" defaultValue={user.display_name} placeholder={t("display_name_placeholder")} />
                </Value>
            </Section>
            <Section>
                <Name>{t("bio")}</Name>
                <Value>
                    <Bio autoComplete="off" name="bio" defaultValue={user.bio} placeholder={t("bio_placeholder")} />
                </Value>
            </Section>
            <Section>
                <ButtonGroup $justifyContent="right">
                    <Button $form={buttonForms.filled} $state={states.primary} type="submit">{t("button_submit")}</Button>
                </ButtonGroup>
            </Section>
        </form>

        <PasswordSection />
    </>
}

const ImgNameEmailContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2.5em;
`

const NameEmail = styled.div`
    display: flex;
    gap: 1em;
    flex-direction: column;
`

const Username = styled.div`
    font-weight: 600;
    font-size: 1.25em;
`

const Email = styled.div`

`

const Bio = styled.textarea`
    height: 7em;
    width: 100%;
    resize: none;
    box-sizing: border-box;
    padding: 1em;
    border: none;
    font-size: 1em;

    border: 1px black solid;
    border-radius: 10px;
`

const SubmitButton = styled(Button)`
    float: right;
`

export default Account