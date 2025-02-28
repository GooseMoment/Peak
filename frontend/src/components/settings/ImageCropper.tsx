import { useState } from "react"

import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"

import { createPortal } from "react-dom"
import Cropper, { type Area } from "react-easy-crop"
import { useTranslation } from "react-i18next"

const el = document.querySelector("#confirmation")!

type ImageCropperProp = {
    file: string
    setCroppedAreaPixels: (area: Area) => void
    onClickOk: () => void
    onClickCancel: () => void
}

const ImageCropper = ({
    file,
    setCroppedAreaPixels,
    onClickOk,
    onClickCancel,
}: ImageCropperProp) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const { t } = useTranslation("settings", { keyPrefix: "profile" })

    const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
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
                style={{
                    containerStyle: {
                        position: "fixed",
                        zIndex: 999,
                    },
                }}
            />
            <StyledButtonGroup>
                <Button form="outlined" state="danger" onClick={onClickCancel}>
                    {t("button_cancel")}
                </Button>
                <Button form="filled" state="success" onClick={onClickOk}>
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
