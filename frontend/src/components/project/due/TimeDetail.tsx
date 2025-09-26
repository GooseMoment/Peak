import { ChangeEvent, useState } from "react"

import styled, { css } from "styled-components"

import Button from "@components/common/Button"

import type { Due, DueDate, DueDatetime, MinimalTask } from "@api/tasks.api"

import { useClientSetting, useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TimeDetail = ({
    task,
    setFunc,
}: {
    task: DueDate | DueDatetime
    setFunc: (diff: Partial<MinimalTask>) => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.due.time" })

    const ampms = [
        { name: "am", display: t("am") },
        { name: "pm", display: t("pm") },
    ]

    const [setting] = useClientSetting()
    const tz = useClientTimezone()

    const due =
        task.due_type === "due_datetime" ? task.due_datetime : task.due_date
    const due_datetime = DateTime.fromISO(due, { zone: tz })

    const [ampm, setAmpm] = useState<string>(ampms[0].name)
    const [hour, setHour] = useState<number>(
        task.due_type === "due_datetime" ? due_datetime.hour : 0,
    )
    const [min, setMin] = useState<number>(
        task.due_type === "due_datetime" ? due_datetime.minute : 0,
    )

    const changeTime = () => {
        const converted_hour =
            !setting.time_as_24_hour && ampm === "pm" ? hour + 12 : hour
        const converted_datetime = due_datetime
            .set({ hour: converted_hour, minute: min })
            .toISO()

        if (converted_datetime === null) return

        setFunc({
            due_type: "due_datetime",
            due_date: null,
            due_datetime: converted_datetime,
        })
        toast.success(t("time_change_success"))
    }

    const removeTime = () => {
        setFunc({
            due_type: "due_date",
            due_date: due_datetime.toISODate(),
            due_datetime: null,
        } as Due)
        toast.error(t("time_remove"))
    }

    const handleHour = (e: ChangeEvent<HTMLInputElement>) => {
        let validInputValue = parseInt(e.target.value)
        if (setting.time_as_24_hour) {
            if (validInputValue > 23) {
                toast.error(t("acceptable_numbers", { max: 23 }), {
                    toastId: "handle_hour",
                })
                validInputValue = validInputValue % 24
            }
            setHour(validInputValue)
        } else {
            if (validInputValue > 12) {
                toast.error(t("acceptable_numbers", { max: 12 }), {
                    toastId: "handle_hour",
                })
                validInputValue = validInputValue % 12
            }
            setHour(validInputValue)
        }
    }

    const handleMinute = (e: ChangeEvent<HTMLInputElement>) => {
        let validInputValue = parseInt(e.target.value)
        if (validInputValue > 59) {
            toast.error(t("acceptable_numbers", { max: 59 }), {
                toastId: "handle_minute",
            })
            validInputValue = 59
        }
        setMin(validInputValue)
    }

    return (
        <DetailBox>
            <FlexBox>
                {setting.time_as_24_hour || (
                    <ToggleBox>
                        {ampms.map((t) => (
                            <AmpmToggle
                                key={t.name}
                                $active={ampm == t.name}
                                onClick={() => {
                                    setAmpm(t.name)
                                }}>
                                {t.display}
                            </AmpmToggle>
                        ))}
                    </ToggleBox>
                )}
                <InputBox>
                    <TimeInput
                        type="number"
                        value={hour ? hour : hour === 0 ? 0 : ""}
                        onChange={handleHour}
                    />
                    <ColonContainer>:</ColonContainer>
                    <TimeInput
                        type="number"
                        value={min ? min : min === 0 ? 0 : ""}
                        onChange={handleMinute}
                    />
                </InputBox>
            </FlexBox>
            <ButtonsBox>
                <Button state="danger" onClick={removeTime}>
                    {t("button_remove")}
                </Button>
                <Button onClick={changeTime}>{t("button_add")}</Button>
            </ButtonsBox>
        </DetailBox>
    )
}

const DetailBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
`

const FlexBox = styled.div`
    display: flex;
    margin-top: 0.3em;
    gap: 1.1em;
`

const ButtonsBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.9em;
    margin-left: 0em;
    gap: 0.6em;
`

const ToggleBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em 0em;
    margin-top: 0.3em;
`

const AmpmToggle = styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5em;
    height: 1.7em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.lineColor};
    color: ${(p) => p.theme.textColor};
    border-radius: 15px;
    font-weight: 500;

    &:hover {
        cursor: pointer;
    }

    ${(props) =>
        props.$active &&
        css`
            background-color: ${(p) => p.theme.goose};
            border: solid 1px ${(p) => p.theme.project.borderColor};
            color: ${(p) => p.theme.white};
        `}
`

const InputBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.3em;
`

const ColonContainer = styled.div`
    font-size: 2em;
    margin: 0 0.3em;
    color: ${(p) => p.theme.textColor};
`

const TimeInput = styled.input`
    width: 1.7em;
    height: 1.7em;
    font-size: 2em;
    text-align: center;
    background-color: ${(p) => p.theme.project.inputColor};
    color: ${(p) => p.theme.textColor};
    appearance: textfield;
    -moz-appearance: textfield;

    &:focus {
        background-color: ${(p) => p.theme.goose};
        color: ${(p) => p.theme.white};
    }

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`

export default TimeDetail
