import { useState } from "react"
import { Fragment } from "react"

import styled, { css } from "styled-components"

import ModalWindow from "@components/common/ModalWindow"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Middle = ({ items  }) => {
    const { t } = useTranslation(null, { keyPrefix: "project_drawer_edit" })

    const [content, setContent] = useState(null)

    const handleClickContent = (e) => {
        const name = e.target.id
        setContent(name)
    }

    return (
        <>
            <Contents>
                {items.map((item, i) => (
                    <Fragment key={item.id}>
                        <ContentBox>
                            {item.icon === "circle" ? (
                                <FeatherIcon
                                    icon={item.icon}
                                    fill={item.color}
                                    stroke="none"
                                />
                            ) : (
                                <FeatherIcon icon={item.icon} />
                            )}
                            <VLine
                                $end={(i === 0) | (i === items.length - 1)}
                            />
                            <ContentText
                                id={item.id}
                                onClick={handleClickContent}>
                                {item.display ? item.display : t("none")}
                            </ContentText>
                        </ContentBox>
                        {content === item.id && (
                            <ModalWindow
                                afterClose={() => setContent(null)}
                                additional>
                                {item.component}
                            </ModalWindow>
                        )}
                    </Fragment>
                ))}
            </Contents>
        </>
    )
}

const Contents = styled.div`
    margin-left: 1.5em;
    margin-bottom: 2em;
`

const ContentBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

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

export default Middle
