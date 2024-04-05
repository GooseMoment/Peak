import { useState } from "react"
import Cropper from "react-easy-crop"
import styled from "styled-components"
import Button from "@components/sign/Button"

const ImageCropper = ({file, setCroppedAreaPixels, onClickOk}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    return <>
    <Cropper
        image={file}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
    />
    <ButtonGroup>
        <CancelButton>Cancel</CancelButton>
        <OkButton onClick={onClickOk}>Apply</OkButton>
    </ButtonGroup>
    </>
}

const ButtonGroup = styled.div`
    position: fixed;
    z-index: 1000;
    left: auto;
    right: auto;
    bottom: 6rem;

    display: flex;
    gap: 2rem;
`

const CancelButton = styled(Button)`
    background-color: red;
    color: white;
    border-color: red;
`

const OkButton = styled(Button)`
    background-color: green;
    color: white;
    border-color: green;
`

export default ImageCropper