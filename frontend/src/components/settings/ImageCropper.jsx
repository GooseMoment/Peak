import { useState } from "react"

import styled from "styled-components"

import Button, { ButtonGroup, buttonForms } from "@components/common/Button"

import { states } from "@assets/themes"

import { createPortal } from "react-dom"
import Cropper from "react-easy-crop"
import { useTranslation } from "react-i18next"

const el = document.querySelector("#confirmation")

const ImageCropper = ({
    file,
    setCroppedAreaPixels,
    onClickOk,
    onClickCancel,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const { t } = useTranslation("settings", { keyPrefix: "account" })

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    return createPortal(
        <>
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
                <Button
                    form={buttonForms.outlined}
                    state={states.danger}
                    onClick={onClickCancel}>
                    {t("button_cancel")}
                </Button>
                <Button
                    form={buttonForms.filled}
                    state={states.success}
                    onClick={onClickOk}>
                    {t("button_apply")}
                </Button>
            </StyledButtonGroup>
        </>,
        el,
    )
}

const StyledButtonGroup = styled(ButtonGroup)`
    position: fixed;
    z-index: 1000;
    left: 50%;
    top: 70%;
    transform: translateX(-50%) translateY(200%);

    padding: 1em;
    border-radius: 10px;
    background-color: ${(p) => p.theme.backgroundColor};

    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`

export default ImageCropper
