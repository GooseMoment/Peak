import { useState } from "react"
import { Fragment } from "react"

import styled, { css } from "styled-components"

import Button from "@components/common/Button"
import ModalWindow from "@components/common/ModalWindow"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Middle = ({
    items,
    isCreate,
    submit = () => {},
    isComponentOpen,
    setIsComponentOpen,
    disabled,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "project.create" })

    const [content, setContent] = useState()

    const handleClickContent = (e) => {
        setIsComponentOpen(true)
        const name = e.target.id
        setContent(name)
    }

    return (
        <>
            {items.map((item) => (
                <Fragment key={item.icon}>
                    <ContentsBox>
                        {item.icon === "circle" ? (
                            <FeatherIcon
                                icon={item.icon}
                                fill={item.color}
                                stroke="none"
                            />
                        ) : (
                            <FeatherIcon icon={item.icon} />
                        )}
                        <VLine $end={item.id === 1 || item.id === 3} />
                        <ContentText
                            id={item.icon}
                            onClick={handleClickContent}
                        >
                            {item.display ? item.display : t("none")}
                        </ContentText>
                    </ContentsBox>
                    {content === item.icon && isComponentOpen ? (
                        <ModalWindow
                            afterClose={() => setIsComponentOpen(false)}
                            additional
                        >
                            {item.component}
                        </ModalWindow>
                    ) : null}
                </Fragment>
            ))}
            {isCreate ? (
                <AddButton disabled={disabled} onClick={submit}>{t("button_add")}</AddButton>
            ) : (
                <EmptyBox />
            )}
        </>
    )
}

const ContentsBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0em 3em;

    & svg {
        width: 1.3em;
        height: 1.3em;
        margin-top: 1.3em;
        top: 0;
        color: ${(p) => p.theme.textColor};
    }
`

const VLine = styled.div`
    border-left: thin solid ${(p) => p.theme.project.lineColor};
    height: 1em;
    margin-top: 1.3em;
    margin-left: 1em;
    transform: scale(1, 3.8);

    ${({ $end }) =>
        $end
            ? css`
                  transform: scale(1, 1.6);
              `
            : null}
`

const ContentText = styled.div`
    font-size: 1em;
    color: ${(p) => p.theme.textColor};
    margin-top: 1.3em;
    margin-left: 1.3em;
    text-decoration: none;

    &:hover {
        cursor: pointer;
    }
`

const AddButton = styled(Button)`
    float: right;
    margin: 1em;
    margin-right: 2.5em;
    margin-bottom: 2em;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`

const EmptyBox = styled.div`
    margin: 2.5em 0em;
`

export default Middle
