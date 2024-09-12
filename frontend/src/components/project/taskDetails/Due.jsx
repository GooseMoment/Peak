import { Fragment, useState } from "react"

import styled, { css } from "styled-components"

import Detail from "@components/project/common/Detail"
import QuickDue from "@components/project/due/QuickDue"
import RepeatDetail from "@components/project/due/RepeatDetail"
import TimeDetail from "@components/project/due/TimeDetail"

import { cubicBeizer } from "@assets/keyframes"
import { rotateToUnder, rotateToUp } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"

const Due = ({ task, setFunc }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.due" })

    const [isAdditionalComp, setIsAdditionalComp] = useState("quick")

    const { closeModal } = useModalWindowCloseContext()

    const handleAdditionalComp = (name) => {
        if (isAdditionalComp === name) setIsAdditionalComp("")
        else {
            if (name === "time") {
                if (!task.due_date) {
                    toast.error(t("time.no_due_before_time"), {
                        toastId: "handle_time_open",
                    })
                    return
                }
            }
            if (name === "repeat") {
                toast.error("coming soon...", {toastId: "coming_soon"})
                return
            }
            setIsAdditionalComp(name)
        }
    }

    let date = new Date()

    const changeDueDate = (set) => {
        return async () => {
            date.setDate(date.getDate() + set)
            let due_date = null
            if (!(set === null)) {
                due_date = date.toISOString().slice(0, 10)
            }
            setFunc({ due_date })
            closeModal()
        }
    }

    const addComponent = [
        {
            name: "quick",
            display: t("quick.title"),
            icon: "menu",
            component: <QuickDue changeDueDate={changeDueDate} />,
        },
        {
            name: "calendar",
            display: t("calendar"),
            icon: "calendar",
            component: <div>달력입니다</div>,
        },
        {
            name: "time",
            display: t("time.title"),
            icon: "clock",
            component: (
                <TimeDetail
                    task={task}
                    setFunc={setFunc}
                    closeComponent={closeModal}
                />
            ),
        },
        {
            name: "repeat",
            display: t("repeat.title"),
            icon: "refresh-cw",
            component: <RepeatDetail />,
        },
    ]

    return (
        <Detail title={t("title")} onClose={closeModal} special={true}>
            {addComponent.map((comp, i) => (
                <Fragment key={comp.name}>
                    <FlexCenterBox>
                        <IndexBox
                            $start={i === 0}
                            $end={i === 3}
                            onClick={() => handleAdditionalComp(comp.name)}
                        >
                            <EmptyBlock />
                            <Box>
                                <FeatherIcon icon={comp.icon} />
                                {comp.display}
                            </Box>
                            <CollapseButton
                                $collapsed={isAdditionalComp === comp.name}
                            >
                                <FeatherIcon icon="chevron-down" />
                            </CollapseButton>
                        </IndexBox>
                    </FlexCenterBox>
                    {isAdditionalComp === comp.name && comp.component}
                    {i !== 3 && <CLine />}
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

export default Due
