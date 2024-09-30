import { Fragment, useState } from "react"

import styled, { css } from "styled-components"

import ModalWindow from "@components/common/ModalWindow"

import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Middle = ({ items }) => {
    const { t } = useTranslation(null, { keyPrefix: "project_drawer_edit" })

    const [content, setContent] = useState(null)

    const handleClickContent = (e) => {
        setContent(e.target.id)
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

    ${ifMobile} {
        margin-left: 1em;
        margin-bottom: 1.5em;
    }
`

const ContentBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & svg {
        flex-shrink: 0;
        width: 1.3em;
        height: 1.3em;
        margin-top: 1.3em;
        margin-right: 0;
        top: 0;
        color: ${(p) => p.theme.textColor};
    }
`

const VLine = styled.div`
    border-left: thin solid ${(p) => p.theme.project.lineColor};
    height: 1em;

    margin: 1.3em 1em 0;

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
    text-decoration: none;

    &:hover {
        cursor: pointer;
    }
`

export default Middle
