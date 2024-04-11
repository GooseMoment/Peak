import { useState } from "react"

import Button, { buttonForms } from "@components/common/Button"

import Cropper from "react-easy-crop"
import styled from "styled-components"
import { states } from "@/assets/themes"

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
        <Button form={buttonForms.OUTLINED} state={states.DANGER}>Cancel</Button>
        <Button form={buttonForms.FILLED} state={states.SUCCESS} onClick={onClickOk}>Apply</Button>
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

export default ImageCropper