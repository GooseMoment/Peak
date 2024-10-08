import { Fragment, useState } from "react"

import styled, { css } from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Detail from "@components/project/common/Detail"
import QuickDue from "@components/project/due/QuickDue"
import RepeatDetail from "@components/project/due/RepeatDetail"

import { useClientTimezone } from "@utils/clientSettings"

import { cubicBeizer } from "@assets/keyframes"
import { rotateToUnder, rotateToUp } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Assigned = ({ setFunc }) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })

    const [isAdditionalComp, setIsAdditionalComp] = useState("quick")

    const tz = useClientTimezone()
    const { closeModal } = useModalWindowCloseContext()

    const handleAdditionalComp = (name) => {
        if (isAdditionalComp === name) setIsAdditionalComp("")
        else {
            if (name === "repeat") {
                toast.error("coming soon...", { toastId: "coming_soon" })
                return
            }
            setIsAdditionalComp(name)
        }
    }

    const today = DateTime.now().setZone(tz)

    const changeAssignedDate = (set) => {
        return async () => {
            const date = today.plus(set)
            let assigned_at = null
            if (!(set === null)) {
                assigned_at = date.toISODate()
            }
            setFunc({ assigned_at })
            closeModal()
        }
    }

    const addComponent = [
        {
            name: "quick",
            display: t("due.quick.title"),
            icon: "menu",
            component: <QuickDue changeDueDate={changeAssignedDate} />,
        },
        {
            name: "calendar",
            display: t("due.calendar"),
            icon: "calendar",
            component: <div>달력입니다</div>,
        },
        {
            name: "repeat",
            display: t("due.repeat.title"),
            icon: "refresh-cw",
            component: <RepeatDetail />,
        },
    ]

    return (
        <Detail title={t("assigned.title")} onClose={closeModal} special={true}>
            {addComponent.map((comp, i) => (
                <Fragment key={comp.name}>
                    <FlexCenterBox>
                        <IndexBox
                            $start={i === 0}
                            $end={i === 2}
                            onClick={() => handleAdditionalComp(comp.name)}>
                            <EmptyBlock />
                            <Box>
                                <FeatherIcon icon={comp.icon} />
                                {comp.display}
                            </Box>
                            <CollapseButton
                                $collapsed={isAdditionalComp === comp.name}>
                                <FeatherIcon icon="chevron-down" />
                            </CollapseButton>
                        </IndexBox>
                    </FlexCenterBox>
                    {isAdditionalComp === comp.name && comp.component}
                    {i !== 2 && <CLine />}
                </Fragment>
            ))}
        </Detail>
    )
}

const FlexCenterBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const CLine = styled.div`
    border-top: thin solid ${(p) => p.theme.project.lineColor};
    width: 90%;
    margin: 0.8em;
`

const IndexBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    height: 1.8em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;
    color: ${(p) => p.theme.textColor};
    font-size: 1em;
    padding: 0em 0.5em;
    margin-top: ${(props) => (props.$start ? 0.8 : 0)}em;
    margin-bottom: ${(props) => (props.$end ? 0.8 : 0)}em;

    & svg {
        margin-right: unset;
    }

    &:hover {
        font-weight: bolder;
        color: ${(p) => p.theme.goose};
        cursor: pointer;
    }
`

const Box = styled.div`
    & svg {
        margin-right: 0.5em;
    }
`

const EmptyBlock = styled.div`
    width: 16px;
    height: 16px;
`

const CollapseButton = styled.div`
    & svg {
        animation: ${rotateToUp} 0.3s ${cubicBeizer} forwards;
    }

    ${(props) =>
        props.$collapsed &&
        css`
            & svg {
                animation: ${rotateToUnder} 0.3s ${cubicBeizer} forwards;
            }
        `}
`

export default Assigned
