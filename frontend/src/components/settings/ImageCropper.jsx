import { useState } from "react"

import Button, { buttonForms, ButtonGroup } from "@components/common/Button"

import Cropper from "react-easy-crop"
import styled from "styled-components"
import { states } from "@assets/themes"

const ImageCropper = ({file, setCroppedAreaPixels, onClickOk, onClickCancel}) => {
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
    <StyledButtonGroup>
        <Button $form={buttonForms.OUTLINED} $state={states.DANGER} onClick={onClickCancel}>Cancel</Button>
        <Button $form={buttonForms.FILLED} $state={states.SUCCESS} onClick={onClickOk}>Apply</Button>
    </StyledButtonGroup>
    </>
}

const StyledButtonGroup = styled(ButtonGroup)`
    position: fixed;
    z-index: 1000;
    left: 50%;
    top: 70%;
    transform: translateX(-50%) translateY(200%);

    padding: 1em;
    border-radius: 10px;
    background-color: ${p => p.theme.backgroundColor};

    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`

export default ImageCropper