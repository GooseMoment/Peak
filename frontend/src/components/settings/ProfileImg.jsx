import { useRef, useState } from "react"

import styled from "styled-components"

import ImageCropper from "@components/settings/ImageCropper"

import { uploadProfileImg } from "@api/users.api"

import getCroppedImg from "@utils/cropImage"

import queryClient from "@queries/queryClient"

import { cubicBeizer } from "@assets/keyframes"

import { Image as ImageIcon } from "feather-icons-react"
import { toast } from "react-toastify"

const ProfileImg = ({ profile_img, username }) => {
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const [fileType, setFileType] = useState(null)

    const [openCropper, setOpenCropper] = useState(false)

    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const input = useRef(null)

    const clickInput = () => {
        input.current.click()
    }

    const handleFileChange = (e) => {
        if (!e.target.files) {
            return
        }

        setFileName(e.target.files[0].name)
        setFileType(e.target.files[0].type)

        const reader = new FileReader()
        reader.addEventListener("loadend", (e) => {
            setFile(e.target.result)
        })

        reader.readAsDataURL(e.target.files[0])
        setOpenCropper(true)
    }

    const onClickOk = async () => {
        setOpenCropper(false)

        toast.promise(cropAndUpload, {
            pending: "Uploading...",
            error: "Error occured.",
            success: "Upload success!",
        })
    }

    const onClickCancel = () => {
        setOpenCropper(false)
    }

    const cropAndUpload = async () => {
        const cropped = await getCroppedImg(file, croppedAreaPixels, fileType)

        let blob = await fetch(cropped).then((r) => r.blob())
        const croppedFile = new File([blob], fileName)

        let formData = new FormData()
        formData.append("profile_img", croppedFile)

        await uploadProfileImg(formData)
        queryClient.invalidateQueries({ queryKey: ["users", "me"] })
        queryClient.invalidateQueries({ queryKey: ["users", username] })
    }

    return (
        <ProfileImgContainer>
            <Img src={profile_img} draggable="false" />
            <ProfileImgOverlay onClick={clickInput}>
                <ImageIcon />
            </ProfileImgOverlay>
            <HiddenInput
                ref={input}
                accept=".jpg,.jpeg,.png"
                id="img_file"
                type="file"
                onChange={handleFileChange}
            />
            {file && openCropper && (
                <ImageCropper
                    file={file}
                    setCroppedAreaPixels={setCroppedAreaPixels}
                    onClickCancel={onClickCancel}
                    onClickOk={onClickOk}
                />
            )}
        </ProfileImgContainer>
    )
}

const ProfileImgContainer = styled.div`
    position: relative;

    user-select: none;
    -webkit-user-select: none;
`

const ProfileImgOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 7em;
    height: 7em;

    border-radius: 999px;
    color: white;
    background-color: black;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 0;

    &:hover {
        opacity: 75%;
    }

    cursor: pointer;

    transition: opacity ${cubicBeizer} 0.25s;

    & svg {
        margin-right: 0;
        width: 2em;
        height: 2em;
    }
`

const Img = styled.img`
    width: 7em;
    height: 7em;
    border-radius: 999px;

    user-select: none;
    background-color: grey;
`

const HiddenInput = styled.input`
    display: none;
`

export default ProfileImg
